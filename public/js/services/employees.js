angular.module('employeeService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Employees', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/employees');
			},
			create : function(data) {
				return $http.post('/api/employees', data);
			},
			delete : function(id) {
				return $http.delete('/api/employees/' + id);
			}
		}
	}]);