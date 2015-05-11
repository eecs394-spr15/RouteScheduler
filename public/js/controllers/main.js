angular.module('RouteOptimizer', [])
	.service('EmployeesService', ['$http',function($http) {
		this.get = function() {
			return $http.get('/api/employees');
		};

		this.create = function(data) {
			return $http.post('/api/employees', data);
		};

		this.delete = function(id) {
			return $http.delete('/api/employees/' + id);
		};
	}])
	// inject the Todo service factory into our controller
	.controller('employeeController', function($scope, EmployeesService) {
		
		EmployeesService.create({
			name: 'John Smith',
			address: '123 Blah St',
			type: 'Technician'
		});
		
		console.log("bleh");
		$scope.formData = {};
		$scope.loading = true;
		
		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
	});