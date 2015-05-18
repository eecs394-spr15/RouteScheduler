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
<<<<<<< HEAD
			
=======
			console.log("hello!");
			var geocoder = new google.maps.Geocoder();
			var Locations = [];
>>>>>>> 6f143edd6140100ed01cf8bae8a491fbe0421033

			$scope.test = function() {
				console.log("hello again");
/*'''
				EmployeesService.getAppointments().
				success(function(data, status, headers, config) {
					$scope.appointments = data;
				}
				'''*/
				var salesNumber=6;
				var homeAddresses=[[41.87355847,-87.79641662],[41.98512347,-87.65592603],[ 41.75050329,-87.69003923],[41.74313511, -87.64126162][41.98124939,-87.61216696],[41.77933782,-87.77089982]];
				var appointments=[[[ 41.95304104, -87.66079453 ],[41.90056597,-87.4538938],[41.85340177, -87.51506404],[41.81984669,-87.52693874],[ 41.95472842,-87.7796233],[41.97387503,-87.58250468]],
				[[ 41.80242171,-87.47432295],[41.87915987,-87.61111856],[41.8855845,-87.55396771],[41.94003661,-87.45577421],[41.78695588,-87.67820154],[41.86954838,-87.65298139]],
				[[41.77982066,-87.66223627],[41.89893941, -87.61800847],[41.82592984,-87.76200356],[41.98791955,-87.5361794],[41.81677539,-87.64333341],[41.9154257,-87.69469442]]];
				var salesmanLocation=new Array(6);
				var routes=new Array(6);
				var DistanceForSales=[0,0,0,0,0,0];//just store it, may show on the page?
				var visited;
				var officeAddress=[41.86928379,-87.5629177];

				for(var i=0;i<salesNumber;i++)
				{
					routes[i]=new Array();
					routes[i].push(homeAddresses[i]);
					salesmanLocation[i]=homeAddresses[i];//end point
				}

				for(var j=2;j>=0;j++)//backwards
				{
					//for each time slot
					visited=[0,0,0,0,0,0]
					for(var k=0;k<salesNumber;k++){
						//for each salesman
						var origin=salesmanLocation[k];//from last point
						var minDistance=1000000;
						var bestDest;
						
						for(var h=0;h<salesNumber;h++){
							//for each appointment
							dest=appointments[j][h];

							distance=$scope.calculateDistance(origin,dest);
							if (distance<minDistance && !visited[h])
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

<<<<<<< HEAD
			
=======
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

			$scope.codeAppointmentsByType("customer");
>>>>>>> 6f143edd6140100ed01cf8bae8a491fbe0421033
	});
