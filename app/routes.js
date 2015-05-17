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

	app.get('/api/salespersons', function(req, res) {
		// get stuff from database
		var addresses = [
			{
			    "_id": {
			        "$oid": "555236d3e4b03aad95c1d21f"
			    },
			    "name": "Moshe Mcfarland",
			    "address": "1020 E Nichols RdUnit 4, Palatine, IL, 60074",
			    "type": "customer"
			},

			{
				"_id": {
			        "$oid": "555236d3e4b03aad95c1d21f"
			    },
			    "name": "Moshe Mcfarland",
			    "address": "1020 E Nichols RdUnit 4, Palatine, IL, 60074",
			    "type": "customer"
			},

			{
					"_id": {
			        "$oid": "555236d3e4b03aad95c1d21f"
			    },
			    "name": "Moshe Mcfarland",
			    "address": "1020 E Nichols RdUnit 4, Palatine, IL, 60074",
			    "type": "customer"
			}
		]

		// run algorithm

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