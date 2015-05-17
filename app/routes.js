var Employee = require('./models/employee');

module.exports = function(app) {

	// api
 	app.get('/api/employees', function(req, res) {
    Employee.find({}, function(err, data) {

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
	app.get('/view', function(req, res) {
	res.render('view');
	});
};