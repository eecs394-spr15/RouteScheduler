var Employee = require('./models/employee');
var Appointment = require('./models/appointment');

module.exports = function(app) {

	// api
 	app.get('/api/employees', function(req, res) {
	    Employee.find(function(err, data) {
	    	if (err)
	      	res.send(err);

	      res.json(data);
	    });
  	});

 	app.get('/api/appointments', function(req, res) {
    Appointment.find(function(err, data) {

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

		var n = 3;
		var m = n * 3;
		var nTotal = n + m + 1; // +1 for the office location

		// initialize stuff needed for algorithm
		// office is node 0
		// saleperson homes are nodes 1 -> n + 1
		// customer locations are nodes n + 1 -> n + 1 + m
		var salesmanLocation = new Array(n);
		var routes=new Array(n);
		for(var i = 0; i < n; i++)
		{
			routes[i]=new Array();
			routes[i].push(0);
			salesmanLocation[i] = 0; // the starting point is the office
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
  		// we only need to fill up half the matrix
  		for (var j = 0; j <= i; j++)
  		{
  			if (i == j)
  			{
  				// nodes distance to itself is 0
  				distanceMatrix[i][j] = 0;
  			}
  			else
  			{
  				distanceMatrix[i][j] = Math.rand();
  			}
  		}
  	}

		var visited = new Array(m); // only need to mark customer nodes as visited
		for (var i = 0; i < m; i++) {
			visited[i] = 0; // nothing is visited
		}

		// for each time slot
		for(var appointment=0; appointment < 3; appointment++)//backwards
		{
			// for each salesman
			for(var salesperson = 0; salesperson < n; salesperson++)
			{
				// translate to location in distance matrix
				var translatedSalesperson = salesperson + 1;
				
				var origin = salesmanLocation[salesperson];//from last point
				var minDistance = Infinity;
				var bestDest = null;
				
				// for each customer destination
				for(var dest = 0; dest < m; dest++){
					// translate to location in distance matrix
					var translatedDest = dest + n + 1;

					distance=$scope.calculateDistance(origin,dest);
					if (distance < minDistance && !visited[dest])
					{
						minDistance=distance;
						bestDest=h;

					}
				}
				routes[j].push(appointments[j][bestDest]);
				visited[bestDest]=1;
				DistanceForSales[k]+=minDistance;

					
			}
			for(var s=0;s<salesNumber;s++)
			{
				DistanceForSales+=$scope.calculateDistance(salesmanLocation[s],officeAddress);
			}
				
		}
		console.log(routes)

		// return json blob of routes
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
};