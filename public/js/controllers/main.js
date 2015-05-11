angular.module('RouteOptimizer', [])

	// inject the Todo service factory into our controller
	.controller('employeeController', ['$scope','$http', function($scope, $http) {
		/*
		Employees.create({
			name: 'John Smith',
			address: '123 Blah St',
			type: 'Technician'
		});
		
		console.log("bleh");
		$scope.formData = {};
		$scope.loading = true;
		*/
		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
	}]);