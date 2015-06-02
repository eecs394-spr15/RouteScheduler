var Employee = require('./models/employee');
var SalesAppointment = require('./models/salesModel');
var Geocode = require('./models/geoCoding');
var OptimizedRoutes = require('./models/route');
var gm = require('googlemaps');

var EARTH_RADIUS = 6378137.0;


OptimizedRoutes.find({}, function(err, data) {
	console.log(data);
})


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

var codeAddress = function(addr){
	gm.geocode({ 'address': addr}, function(results, status)
			{
				if (status == google.maps.GeocoderStatus.OK)
				{
					console.log("Geocoding success!");

					Geocode.create({
						address : addr,
						coord: {lat: results[0].geometry.location.A, lon: results[0].geometry.location.f}
					});
				}
				else
				{
					alert('Geocode failed because: ' + status);
				}
			});
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

 	app.get('/api/salesAppts', function(req, res) {
	    SalesAppointment.find({}, function(err, data) {

	    //SalesAppointmentModel.find({ApptDate: d.getFullYear()+"-"+0+(d.getMonth()+1)+"-"+(d.getDate()-1)+"T00:00:00.000Z"},function(err,data){
	    	
	    	if (err)
	      	res.send(err);

	      res.json(data);
	    });
	  });

	app.post('/api/employees', function(req, res) {
		Employee.create({
			name : req.body.name,
			address : req.body.address,
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
			res.end("successful geocode create");
		});
	});

	app.get('/api/salesperson-routes', function(req, res) {
		var d=new Date();
		var date = d.getFullYear()+"/"+(d.getMonth()+1)+"/"+(d.getDate()-1)
	 	SalesAppointment.find({ApptDate: date},function(err, data)
	 	{
			var appointments=data[0].Appointments;
			console.log(appointments);
			Geocode.find({}, function(err, geocodes)
			{
				Employee.find({type: "Salesperson"}, function(err, employees)
				{
					//console.log(geocodes);

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

					// assume n salespeople and m customers
					// the first n rows of the sales
					// I am using a full distance matrix because im pretty sure thats how a real non-greedy algorithm would work.
					// and I don't care if it is more inefficient

					/*
					var nSalespeople = 3;
					var nAppointments = appointments.length;
					var nTotal = nSalespeople + nAppointments + 1; // +1 for the office location

					var count=0;
					var aList=[{
						"name":"GreenBay office",
						"address":"1125 Tuckaway Ln, Menasha, WI 54952",
						"coord":{"lat":44.2357938,"lon":-88.4239336}
					},
					{
				    "name":"Hinkley, Elizabeth A.",
				    "address":"506 N. Center St",
				    "city":"Appleton",
				    "state":"WI",
				    "zip":54911,
				    "team":"Green Bay",
				    "type":"Salesperson",
				    "coord":{"lat":44.265963,"lon":-88.395845}
					},
					{
				    "name":"Romnek, Michael E.",
				    "address":"2400 E John St",
				    "city":"Appleton",
				    "state":"WI",
				    "zip":54915,
				    "team":"Green Bay",
				    "type":"Salesperson",
				    "coord":{"lat":44.247456,"lon":-88.370005}
					},
					{
				    "name":"Stratton, Erik D.",
				    "address":"4715 Turkey Trail",
				    "city":"Amherst",
				    "state":"WI",
				    "zip":54406,
				    "team":"Green Bay",
				    "type":"Salesperson",
				    "coord":{"lat":44.4439691,"lon":-89.3185814}
		  		}];
		  		*/

		  			//check if employees' address are geocoded, if not, geocode them
		  			//Store geocode data in EmployeeLocs array
		  			var AddressesToFetch = [];
		  			var EmployeeLocs = [];
		  			for(i = 0; i < employees.length; i++){
		  				Geocode.find({'address' : employees[i].address}, function(err, data) {
							if(!data.length){
								console.log("No geocode found for employee address");
								codeAddress(employees[i].address);
								AddressesToFetch.push(employees[i].address);
							}
							else{
								EmployeeLocs.push(data[0].coord);
							}
						});
		  			}
		  			while(AddressesToFetch.length > 0){
			  			for(i = 0; i < AddressesToFetch.length; i++){
			  				Geocode.find({'address' : AddressesToFetch[i]}, function(err, data) {
								if(!data.length)
									console.log("Still missing geocode for employee address")
								else{
									EmployeeLocs.push(data[0].coord);
									AddressesToFetch.splice(i, 1);
								}
							});
			  			}}

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
								console.log("geocode found for this address");
								appointments[i]["coord"] = geocodes[j]["coord"];
								aList.push(appointments[i]);
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
						routes[i]["employee"] = aList[i+1];
						routes[i]["routeDate"] = date;
						routes[i]["appointmentList"] = [];

						// the starting point is the office
						routes[i]["appointmentList"].push(aList[0]);
						salespersonLocation[i] = 0;
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
			  				// this is where we will call calculateDistance
			  				var dist = calculateDistance(aList[i]["coord"]["lat"],
			  																		 aList[j]["coord"]["lat"],
			  																		 aList[i]["coord"]["lon"],
			  																		 aList[j]["coord"]["lon"]);
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
						routes[i]["appointmentList"].push(aList[i+1]);
						OptimizedRoutes.create(routes[i], function(err, employee) {
							if (err)
								res.send(err);
						});
					}


				// return json blob of routes
				});
			});
		});
	});

	app.post('/api/salesAppts', function(req, res) {
		SalesAppointment.create({
			Appointments: req.body,
			ApptDate: "05/23/2015"
		}, function(err, employee) {
			if (err)
				res.send(err);

			res.end("successfully created sales appointments");
		});
	});

	/*
	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			getTodos(res);
		});
	});
*/

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