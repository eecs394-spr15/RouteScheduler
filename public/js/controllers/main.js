angular.module('RouteOptimizer', [])
	.service('EmployeesService', ['$http',function($http) {
		this.get = function() {
			return $http.get('/api/employees');
		};

		this.getAppointments = function() {
			return $http.get('/api/appointments');
		};

		this.create = function(data) {
			return $http.post('/api/employees', data);
		};

		this.delete = function(id) {
			return $http.delete('/api/employees/' + id);
		};
	}])
	// inject the Todo service factory into our controller
	.controller('addEmployeeController', function($scope, $window, EmployeesService) {
		$scope.create = function(employee) {
			EmployeesService.create({
				name: employee.name,
				address: employee.address,
				type: employee.type
			});
			alert("Employee successfully added. Redirecting to main page.");
			$window.location.assign("/");

		}
	})

	.controller('algorithmController', function($scope, $window, EmployeesService) {

			$scope.test = function() {
				console.log("hello again");
/*'''
				EmployeesService.getAppointments().
				success(function(data, status, headers, config) {
					$scope.appointments = data;
				}
				'''*/
				var salesMan=[1,2,3,4,5,6];
				var distanceMatrix=[[5,2,5,7,8,9],[9,1000,5,3,2,9],[6,1000,7,6,1000,4],[3,1000,3,9,1000,1000],[1000,1000,4,7,1000,1000],[1000,1000,1000,3,1000,1000]];
				var route=[0,0,0,0,0,0];
				var minimum=1000;
				var minsales=0;
				
				for (var i = distanceMatrix.length - 1; i >= 0; i--) {
					for (var j = distanceMatrix[i].length - 1; j >= 0; j--) {
						if(distanceMatrix[i][j]<minimum)
						{
							minimum=distanceMatrix[i][j];
							minsales=j+1;//but j is not salesman's number, it should use the info in distansMatrix[i][j];
						}
					};
					route[minsales]=i;
					minimum=1000;
				};
				console.log(route);
			/*'''	var zero = $scope.otherfunc();
				console.log(zero);'''*/
			}

			$scope.otherfunc = function() {
				return 0;
			}
	});
