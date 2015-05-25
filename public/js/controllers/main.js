var RouteOpt = angular.module('RouteOptimizer', []);


RouteOpt.service('EmployeesService', ['$http',function($http) {
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

		this.postGeocode = function(data) {
			return $http.post('/api/geocode', data);
		};

		this.getGeocode = function(address) {
			return $http.get('/api/geocode/' + address);
		};

		this.getAppointments = function() {
			return $http.get('/api/appointments');
		};

		this.getOptimizedSalespersonRoutes = function() {
			return $http.get('/api/salesperson-routes');
		};
	}]);


RouteOpt.factory('Appointments', ['$http',function($http) {
		
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
	}])

RouteOpt.controller('addEmployeeController', function($scope, $window, EmployeesService) {
		$scope.create = function(employee) {
			EmployeesService.create({
				name: employee.name,
				address: employee.address,
				type: employee.type
			});
			alert("Employee successfully added. Redirecting to main page.");
			$window.location.assign("/");

		}
	});

RouteOpt.controller('algorithmController', function($scope, $window, EmployeesService) {
			
			$scope.test = function() {
				

				EmployeesService.getOptimizedSalespersonRoutes()
					.success(function(data, status, headers, config){
						console.log(data);
					})
					.error(function(data, status, headers, config){
						console.log("Error getting optimized salesperson routes" + status);
					});
			}

			
	});

RouteOpt.controller('DisplayEmployeeController', function($scope, $window, EmployeesService) {

		
		EmployeesService.get().
			success(function(data, status, headers, config) {
				$scope.view = data;
		}).
		error(function(data, status, headers, config) {
		    console.log("an error occurred fetching employees")
		});	
		

		$scope.test = function() {
			EmployeesService.get().
  			success(function(data, status, headers, config) {
			    console.log(data);
			}).
			error(function(data, status, headers, config) {
			    console.log("an error occurred fetching employees")
			});

		};
		
		
	  
	});

RouteOpt.controller('uploadController', function($scope, $rootScope, Appointments, EmployeesService) {

	var geocoder = new google.maps.Geocoder();
	var Locations = [];

	$scope.uploadFile = "";
	
	$scope.fileType = "sales";

	$scope.csvJSON = function(csv){ 
	  
		var reader = new FileReader();

		reader.onload = function(evt) {
			console.log("parse started");
		  
		  var csv = this.result;
		  console.log(csv);
		  var lines = csv.split("\n");

		  var result = [];
		 
		  var headers = lines[0].match(/(?:[^,"\r]+|"[^"]*")+/g);
			
		  console.log(headers);			 	

		  for(var i=1;i<lines.length;i++){
		 
			  var obj = {};
			  
			  var currentline=lines[i].match(/(?:[^,"\r]+|"[^"]*")+/g);				
		 
			  if(currentline != null) {
				  for(var j=0;j<headers.length;j++){
					  obj[headers[j]] = currentline[j];
				  }					
		 
			  	result.push(obj);
			  }
		 
		  }
		  var i=0;
		  var address;
		  function storeGeo(){
		  	address=result[i]['Job Site'];
		  	i++;
		  	EmployeesService.getGeocode(address)
					.success(function(data, status, headers, config) {
						// if nothing was returned, geocode the address
						console.log(data);
						if (!data.length)
						{
							console.log("no geocode for this address found in database")
							$scope.codeAddress(address);
						}
					})
					.error(function(data, status, headers, config) {
					    console.log("an error occurred looking for geocoded address");
					});	
			if(i<result.length)
				setTimeout(storeGeo(),200);
		  }
		  storeGeo();
		  /*
		  for (var i = 0; i < result.length; i++) {
		  	var address = result[i]['Job Site'];

		  	// check if we have already geocoded this address
		  	EmployeesService.getGeocode(address)
					.success(function(data, status, headers, config) {
						// if nothing was returned, geocode the address
						console.log(data);
						if (!data.length)
						{
							console.log("no geocode for this address found in database")
							setTimeout($scope.codeAddress(address), 200);
						}
					})
					.error(function(data, status, headers, config) {
					    console.log("an error occurred looking for geocoded address");
					});	
		  }
		  */
		  
		  Appointments.addSales(JSON.stringify(result));
		  console.log("finished parsing");			  
		}

		reader.readAsText($scope.uploadFile);

	}

	$scope.codeAddress = function(address) {
			console.log("Calling geocoder...");
			geocoder.geocode({ 'address': address}, function(results, status)
			{
				if (status == google.maps.GeocoderStatus.OK)
				{
					console.log("Geocoding success!");

					EmployeesService.postGeocode({
						'address': address,
						'coord' : {lat: results[0].geometry.location.A, lon: results[0].geometry.location.F}
					});
				}
				else
				{
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
	});

RouteOpt.controller('viewAppointmentsCtrl', function($scope, $rootScope, Appointments) {


	Appointments.getSales().
		success(function(data, status, headers, config) {
			$scope.appointments = data;
			console.log(JSON.stringify($scope.appointments));
	}).
	error(function(data, status, headers, config) {
	    console.log("an error occurred fetching Appointments");
	});	
	

	$scope.headers = ["Appt Id", "Start Time", "End Time", "Opportunity #", "Customer Name", "Job Site"];
	$scope.noAppts = function() {
		//update later once appointments come from backend
		return false;
	};

  function getHeaders (appt) {
  	for (var i = 0; i < appt.length; i++) {
  		Things[i]
  	};
  };
	
});

RouteOpt.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
