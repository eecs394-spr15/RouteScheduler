var Employee = require('./models/employee');
var salesAppointments = require('./models/salesModel');

var EARTH_RADIUS = 6378137.0;

var getRad = function(d){
	return d*Math.PI/180.0;
}
var calculateDistance = function(origin, dest) {
	var lat1=origin[0];
	var lat2=dest[0];
	var lng1=origin[1];
	var lng2=dest[1];
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
			type : req.body.type
		}, function(err, employee) {
			if (err)
				res.send(err);
		});

	});

	app.get('/api/salesperson-routes', function(req, res) {
		var d=new Date()
	 	salesAppointments.find({ApptDate: d.getFullYear()+"-"+0+(d.getMonth()+1)+"-"+（d.getDate()－1）+"T00:00:00.000Z"},function(err,data){
			appointments=data.Appointments;

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
			var nSalespeople = 3;
			var nAppointments = nSalespeople * 3;
			var nTotal = nSalespeople + nAppointments + 1; // +1 for the office location

			// initialize stuff needed for algorithm
			// office is node 0
			// saleperson homes are nodes 1 -> n + 1
			// customer locations are nodes n + 1 -> n + 1 + m
			var salespersonLocation = new Array(nSalespeople);
			var routes=new Array(nSalespeople);
			for(var i = 0; i < nSalespeople; i++)
			{
				routes[i]=new Array();
				routes[i].push(0);
				salespersonLocation[i] = 0; // the starting point is the office
			}
			
			// distance matrix
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
	  				var dist = Math.random();
	  				distanceMatrix[i][j] = dist;
	  				distanceMatrix[j][i] = dist;
	  			}
	  		}
	  	}

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
						if (distance < minDistance && !visited[dest])
						{
							minDistance = distance;
							bestTranslatedDest = translatedDestIdx;
							bestDest = dest;
						}
					}

					if (bestTranslatedDest) {
						routes[salesperson].push(bestTranslatedDest);
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
				routes[i].push(i+1);
			}

			console.log(routes)

			// return json blob of routes
		});
		

	})

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