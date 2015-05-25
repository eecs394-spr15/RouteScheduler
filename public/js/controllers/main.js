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
			var EARTH_RADIUS = 6378137.0;    //
    		var PI = Math.PI;

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
			/*
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
				*/
			}

			getRad = function(d){
				return d*PI/180.0;
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
						var i;
						var j;
						for(i = 0; i < data.length; i++){
							if(data[i].type == AType)
								$Addresses.push(data[i].address);
						}
						for(i = 0; i < Addresses.length; i+=5){
							setTimeout(function(){for(j = 0; j < 5; j++){
														if(i+j >= Addresses.length)
															break;
														$scope.codeAddress(Addresses[i+j]);
													}}, 1000)
							if(i+j >= Addresses.length)
								break;
						}
						console.log(Locations);
					})
					.error(function(data, status, headers, config){
						console.log("Error occurred fetching appointments: " + status);
					});
			}

			codeAddressesTest = function(){
				var Addresses = [];
				var temp = [];
				var i;
				var j;
				Addresses.push("Wichita, KS");
				Addresses.push("Madison, WI");
				Addresses.push("Omaha, NE");
				Addresses.push("Chicago, IL");
				Addresses.push("Orlando, FL");
				Addresses.push("Evanston, IL");
				Addresses.push("Milwaukee, WI");
				Addresses.push("Los Angeles, CA");
				Addresses.push("Minneapolis, MN");
				Addresses.push("Anaheim, CA");
				Addresses.push("Denver, CO");
				Addresses.push("Manhattan, NY");
				Addresses.push("San Francisco, CA");
				Addresses.push("Trenton, NJ");
				Addresses.push("Boston, MA");
				Addresses.push("Boulder, CO");
				Addresses.push("Baltimore, MD");
				Addresses.push("Kansas City, MO");
				Addresses.push("Washington DC");
				Addresses.push("Oregon, WI");
				Addresses.push("Appleton, WI");
				Addresses.push("Louisville, KY");
				//for(i = 0; i < data.length; i++){
				//	if(data[i].type == AType)
				//		$Addresses.push(data[i].address);
				//}
				for(i = 0; i < Addresses.length; i+=5){
					for(j = 0; j < 5; j++){
						console.log(i+j);
						if(i+j >= Addresses.length)
							break;
						temp.push(Addresses[i+j]);
						}
					setTimeout(function(){codeArray(temp)}, 1000);
					if(i+j >= Addresses.length)
						break;
				}
			}

			codeArray = function(arry){
				for(var i = 0; i < arry.length; i++)
					console.log(arry[i]);
				arry = [];
			}
			
			//var A=[41.87355847,-87.79641662];
			//var B=[41.98512347,-87.65592603];
			//console.log($scope.calculateDistance(A,B));
			codeAddressesTest();
	});
