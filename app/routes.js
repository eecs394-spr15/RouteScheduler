var Employee = require('./models/employee');
var SalesAppointment = require('./models/salesModel');
var Geocode = require('./models/geoCoding');
var OptimizedRoutes = require('./models/route');

var EARTH_RADIUS = 6378137.0;

var getRad = function(d){
	return d*Math.PI/180.0;
}

var calculateDistance = function(lat1,lat2,lng1,lng2) {

	var f = getRad((lat1 + lat2)/2);
    var g = getRad((lat1 - lat2)/2);
    var l = getRad((lng1 - lng2)/2);
    
    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);
    
    var s,c,w,r,d,h1,h2;
    var a = EARTH_RADIUS;
    var fl = 1/298.257;
    
    sg = sg*sg;
    sl = sl*sl;
    sf = sf*sf;
    
    s = sg*(1-sl) + (1-sf)*sl;
    c = (1-sg)*(1-sl) + sf*sl;
    
    w = Math.atan(Math.sqrt(s/c));
    r = Math.sqrt(s*c)/w;
    d = 2*w*a;
    h1 = (3*r -1)/2/c;
    h2 = (3*r +1)/2/s;
    
    return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
}

module.exports = function(app) {

	// api
 	app.get('/api/employees', function(req, res) {
	    Employee.find(function(err, data) {
	    	if (err)
	      	res.send(err);

	      res.json(data);
	    });
  	});

 	app.post('/api/employees', function(req, res) {
		Employee.create({
			name : req.body.name,
			address : req.body.address,
			type : req.body.type,
			team : req.body.team
		}, function(err, employee) {
			if (err)
				res.send(err);
		});

	});

	app.delete('/api/employees/:_id', function(req, res) {
		Employee.remove({
			_id : req.params._id
		}, function(err, employee) {
			if (err)
				res.send(err);
		});
	});

 	app.get('/api/salesAppts', function(req, res) {
	    var d=new Date();
	 	
	 	SalesAppointment.find({ApptDate: d.getFullYear()+"/"+(d.getMonth()+1)+"/"+(d.getDate())},function(err,data){
	 		console.log(data);
	 		var appointments = [];
			if(data.length > 0) {
				console.log(data[data.length - 1].ApptDate);
				appointments=data[data.length - 1].Appointments;
			}

			console.log(appointments);
	    	
	    	if (err)
	      	res.send(err);

	        res.json(appointments);
	    });
	});

	app.post('/api/salesAppts', function(req, res) {
		var d = new Date();

		SalesAppointment.create({
			Appointments: req.body,
			ApptDate: (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear()
		}, function(err, employee) {
			if (err)
				res.send(err);
		});
	});

	app.post('/api/employees', function(req, res) {
		Employee.create({
			name : req.body.name,
			address : req.body.address,
			team : req.body.team,
			type : req.body.type
		}, function(err, employee) {
			if (err)
				res.send(err);
		});
	});

	app.get('/api/geocode/:address', function(req, res) {
		var address = req.params.address;
		Geocode.find({'address' : address}, function(err, data) {
			if (err)
				res.send(err);
			res.json(data);
		});
	});

	app.post('/api/geocode', function(req, res) {
		Geocode.create({
			address : req.body.address,
			coord : req.body.coord
		}, function(err, geocode) {
			if (err)
				res.send(err);
			console.log("create geocode");
			res.end("successful geocode create");
		});
	});




	app.get('/api/salesperson-routes', function(req, res) {
		var d=new Date();
		var date = d.getFullYear()+"/"+(d.getMonth()+1)+"/"+(d.getDate()-1)
	 	SalesAppointment.find({},function(err, data)
	 	{
			var appointments=data[0].Appointments;
			console.log(appointments);
			Geocode.find({}, function(err, geocodes)
			{
				Employee.find({type: "Sales"}, function(err, employees)
				{
					console.log("employees: ", employees);
					console.log("geocodes: ", geocodes);

					// add a check right here if the optimized routes are already in the database?
					// then don't run the algorithm

					// run algorithm

					// there will be a separate task for calculating the distance matrix..
					// just hard code it for now
					// this is old stuff
					//var homeAddresses=[[41.87355847,-87.79641662],[41.98512347,-87.65592603],[ 41.75050329,-87.69003923],[41.74313511, -87.64126162][41.98124939,-87.61216696],[41.77933782,-87.77089982]];
					//var appointments=[[[ 41.95304104, -87.66079453 ],[41.90056597,-87.4538938],[41.85340177, -87.51506404],[41.81984669,-87.52693874],[ 41.95472842,-87.7796233],[41.97387503,-87.58250468]],
					//[[ 41.80242171,-87.47432295],[41.87915987,-87.61111856],[41.8855845,-87.55396771],[41.94003661,-87.45577421],[41.78695588,-87.67820154],[41.86954838,-87.65298139]],
					//[[41.77982066,-87.66223627],[41.89893941, -87.61800847],[41.82592984,-87.76200356],[41.98791955,-87.5361794],[41.81677539,-87.64333341],[41.9154257,-87.69469442]]];
					//var officeAddress=[41.86928379,-87.5629177];

					// the first n rows of the sales
					// I am using a full distance matrix because im pretty sure thats how a real non-greedy algorithm would work.
					// and I don't care if it is more inefficient

					var nSalespeople = employees.length;
					var nAppointments = appointments.length;
					var nTotal = nSalespeople + nAppointments + 7; // +7 for the office locations

					var count=0;
					var aList=[
					{
						"name":"GreenBay",
						"address":"1125 Tuckaway Ln, Menasha, WI 54952",
						"coord":{"lat":44.2357938,"lon":-88.4239336}
					},
					{
						"name":"Madison",
						"address":"3037 S. Stoughton Rd, Madison, WI 53716",
						"coord":{"lat":43.05324,"lon":-89.307581}
					},
					{
						"name":"Milwaukee",
						"address":"5801 S. Pennsylvania Ave, Cudahy, WI 53110",
						"coord":{"lat":42.938382,"lon":-87.882969}
					},
					{
						"name":"Peoria",
						"address":"1401 West Glen, Peoria, IL 61614",
						"coord":{"lat":40.74777,"lon":-89.613891}
					},
					{
						"name":"Rockford",
						"address":"4322 Maray Drive, Rockford, IL 61108",
						"coord":{"lat":44.2357938,"lon":-89.031492}
					},
					{
						"name":"South",
						"address":"9932 S. Western Avenue, Chicago, IL 60643",
						"coord":{"lat":41.71269,"lon":-87.68216}
					},
					{
						"name":"North",
						"address":"125 E. Oakton, Des Plaines, IL 60018",
						"coord":{"lat":42.022436,"lon":-87.914881}
					}];

					for (i = 0; i < employees.length; i++)
					{
						var address = employees[i]["address"];
						// find the geocoded address for this appointment
						var found = false;
						for (var j = 0; j < geocodes.length; j++)
						{
							if (geocodes[j]["address"] == address)
							{
								found = true;
								console.log("geocode found for this address");
								employees[i]["coord"] = geocodes[j]["coord"];
								aList.push(employees[i]);
								break;
							}
						}
						if (!found) {
							aList.push(employees[i]);
							console.log("no geocode found for this employee... something is terribly wrong!");
						}
					}

		  		// insert coords into the appointments array
		  		// push into aList array
					for (i = 0; i < appointments.length; i++)
					{
						var address = appointments[i]["Job Site"];
						// find the geocoded address for this appointment
						var found = false;
						for (var j = 0; j < geocodes.length; j++)
						{
							if (geocodes[j]["address"] == address)
							{
								found = true;
								console.log("geocode found for this address");
								console.log(appointments[i]);
								var newAppt = {};
								newAppt['coord'] = geocodes[j]['coord'];
								newAppt['Appt Id'] = appointments[i]['Appt Id'];
							  newAppt['Start Time'] = appointments[i]['Start Time'];
							  newAppt['End Time'] = appointments[i]['End Time'];
							  newAppt['Opportunity #'] = appointments[i]['Opportunity #'];
							  newAppt['Customer Name'] = appointments[i]['Customer Name'];
							  newAppt['Job Site'] = appointments[i]['Job Site'];
								console.log(newAppt);
								aList.push(newAppt);
								break;
							}
						}
						if (!found) {
							// possibly geocode the address now?
							console.log("no geocode found for this address... something is terribly wrong!");
						}
					}

					// initialize stuff needed for algorithm
					// office is node 0
					// saleperson homes are nodes 1 -> n + 1
					// customer locations are nodes n + 1 -> n + 1 + m
					var salespersonLocation = new Array(nSalespeople);
					var routes=new Array(nSalespeople);
					for(var i = 0; i < nSalespeople; i++)
					{
						routes[i]={};
						routes[i]["employee"] = employees[i];
						routes[i]["routeDate"] = date;
						routes[i]["appointmentList"] = [];

						// the starting point is the office
						console.log("employee ", i, ": ", employees[i]);
						for (var j = 0; j < 6; j++)
						{
							if(employees[i].team == aList[j].name)
							{
								salespersonLocation[i] = j;
							}
						}
					}

					//an array of all man and address & location 
					var timeSlot=["12:30:00 PM","3:30:00 PM","6:30:00 PM"];
					for(var slot=0; slot<3; slot++){
						for (var k=0; k < nAppointments; k++)
						{
							//console.log(appointments[k]);
							if(appointments[k]["Start Time"]==timeSlot[slot]){
								count += 1;
							}
							if(count>=nSalespeople)
							{
								// notify the user that we don't have enough salespeople
								console.log("throw an error here, not enough salespeople for the number of appointments");
								break;
							}
						}
						if (count<nSalespeople)
						{
							// change the time slot to false so we know that there wasn't enough appointments for all salespeople for this time slot
							// or that there were constraints so
							// timeSlot[slot] = false;
						}
						count=0;
					}

					console.log("alist: ", aList);

					// distance matrix
					console.log("distance matrix starting");

					var distanceMatrix = new Array(nTotal);
			  	for (var i = 0; i < nTotal; i++)
			  	{
			    	distanceMatrix[i] = new Array(nTotal);
			  	}

			  	// fill distance matrix with garbage
			  	for (var i = 0; i < nTotal; i++)
			  	{
			  		// half of the matrix is same as the other half
			  		for (var j = 0; j <= i; j++)
			  		{
			  			if (i == j)
			  			{
			  				// nodes distance to itself is 0
			  				distanceMatrix[i][j] = 0;
			  			}
			  			else
			  			{
			  				console.log("alist i: ", i, ": ", aList[i]);
			  				console.log("alist j: ", j, ": ", aList[j]);
			  				console.log("alist i coord: ", aList[i]["coord"]);
			  				if (!aList[i].coord)
			  				{
				  				var bleh = JSON.parse(aList[i]);
									console.log(bleh.coord);
								}
			  				// this is where we will call calculateDistance
			  				var dist = calculateDistance(aList[i].coord.lat,
			  																		 aList[j].coord.lat,
			  																		 aList[i].coord.lon,
			  																		 aList[j].coord.lon);
			  				distanceMatrix[i][j] = dist;
			  				distanceMatrix[j][i] = dist;
			  			}
			  			
			  		}
			  	}
			  	console.log("distance matrix finished");

					var visited = new Array(nAppointments); // only need to mark customer nodes as visited
					for (var i = 0; i < nAppointments; i++)
					{
						visited[i] = false; // nothing is visited
					}

					// for each time slot
					for(var appointment=0; appointment < 3; appointment++)
					{
						// for each salesman
						for(var salesperson = 0; salesperson < nSalespeople; salesperson++)
						{
							// translate to location in distance matrix
							var translatedSalespersonIdx = salesperson + 1;
							
							// origin does not need translated
							var origin = salespersonLocation[salesperson];//from last point
							var minDistance = Infinity;
							var bestDest = null;
							var bestTranslatedDest = null;
							
							// for each customer destination
							for(var dest = 0; dest < nAppointments; dest++)
							{
								// translate to location in distance matrix
								var translatedDestIdx = dest + nSalespeople + 1;
								// get distance from distance matrix
								distance = distanceMatrix[translatedSalespersonIdx][translatedDestIdx];
								var time = aList[translatedDestIdx]["Start Time"];
								if (distance < minDistance && !visited[dest] && timeSlot[appointment] == time)
								{
									minDistance = distance;
									bestTranslatedDest = translatedDestIdx;
									bestDest = dest;
								}
							}

							if (bestTranslatedDest) {
								routes[salesperson]["appointmentList"].push(aList[bestTranslatedDest]);
								visited[bestDest] = true;
								salespersonLocation[salesperson] = bestTranslatedDest;
							}
							else 
							{
								console.log("something went wrong: ", bestDest);
							}
						}
					}

					// append salesperson home to the route
					for (var i = 0; i < nSalespeople; i++)
					{
						OptimizedRoutes.create(routes[i], function(err, employee) {
							if (err)
								res.send(err);
						});
					}

					console.log("everything done");
					console.log(routes);
					res.json(routes);
				});
			});
		});
	});




	// application -------------------------------------------------------------

	app.get('/', function(req, res) {
		res.render('index');
	});
	app.get('/results', function(req, res) {
		res.render('results');
	});
	app.get('/upload', function(req, res) {
		res.render('upload');
	});
	app.get('/manage', function(req, res) {
		res.render('addemployee');
	});
	app.get('/appointments', function(req, res) {
		res.render('appointments');
	});
	app.get('/employees', function(req, res) {
		res.render('employees');
	});
	
};