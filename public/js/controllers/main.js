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

		this.getAppointments = function() {
			return $http.get('/api/appointments');
		};

		this.getOptimizedSalespersonRoutes = function() {
			return $http.get('/api/salesperson-routes');
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

			var geocoder = new google.maps.Geocoder();
			var Locations = [];

			$scope.test = function() {
				

				EmployeesService.getOptimizedSalespersonRoutes()
					.success(function(data, status, headers, config){
						console.log(data);
					})
					.error(function(data, status, headers, config){
						console.log("Error getting optimized salesperson routes" + status);
					});
/*
				for (var k= salesMan.length-1;k>=0;k--)
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

			$scope.calculateDistance = function(origin, dest) {
				lat1=origin[0];
				lat2=dest[0];
				lon1=origin[1];
				lon2=dest[1];
				var R = 6371000; // metres
				var φ1 = lat1*Math.PI/180;
				var φ2 = lat2*Math.PI/180;
				var Δφ = (lat2-lat1)*Math.PI/180;
				var Δλ = (lon2-lon1)*Math.PI/180;

				var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
				        Math.cos(φ1) * Math.cos(φ2) *
				        Math.sin(Δλ/2) * Math.sin(Δλ/2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

				var d = R * c;
				return d;
			}

			$scope.codeAddress = function(address) {
				console.log("Calling geocoder...");
				geocoder.geocode({ 'address': address}, function(results, status){
					if (status == google.maps.GeocoderStatus.OK){
						console.log("Geocoding success!");
						Locations.push(results[0].geometry.location);
						console.log(Locations);
					}
					else{
						alert('Geocode failed because: ' + status);
					}
				});
			}

			$scope.codeAppointmentsByType = function (AType) {
				EmployeesService.getAppointments()
					.success(function(data, status, headers, config){
						var Addresses = [];
						for(var i = 0; i < data.length; i++){
							if(data[i].type == AType)
								$scope.codeAddress(data[i].address);
						}
					})
					.error(function(data, status, headers, config){
						console.log("Error occurred fetching appointments: " + status);
					});
			}

			//$scope.codeAppointmentsByType("customer");
	});
