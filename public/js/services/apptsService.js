angular.module('ApptsService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Appointments', ['$http',function($http) {
		return {
			getSales : function() {
				return $http.get('/api/salesAppts');
			},
			addSales : function(data) {
				return $http.post('/api/salesAppts', data);
			},
			getTech : function() {
				return $http.get('/api/techAppts');
			},
			addTech : function(data) {
				return $http.post('/api/techAppts', data);
			}
		}
	}]);