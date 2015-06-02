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
		};
	}]);

RouteOpt.controller('addEmployeeController', function($scope, $window, EmployeesService, Appointments) {
		var geocoder = new google.maps.Geocoder();

		$scope.create = function(employee) {
			EmployeesService.create({
				name: employee.name,
				address: employee.address,
				type: employee.type
			});
			$scope.codeAddress(employee.address);
		};

		$scope.remove = function(id) {
			EmployeesService.delete(id);
			alert("Employee successfully deleted. Redirecting to employees page.");
			$window.location.assign("/employees");	
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
					})
					.success(function(err){
						alert("Employee successfully added. Redirecting to employees page.");
						$window.location.assign("/employees");
					});
				}
				else
				{
					alert('Geocode failed because: ' + status);
				}
			});
		}
	});

RouteOpt.controller('algorithmController', function($scope, $window, EmployeesService) {

	$scope.computing = false;
	$scope.test = function() {
		$scope.computing=true;

		EmployeesService.getOptimizedSalespersonRoutes()
			.success(function(data, status, headers, config){
				console.log(data);
				$scope.computing = false;
			})
			.error(function(data, status, headers, config){
				console.log("Error getting optimized salesperson routes" + status);
				$scope.computing = false;
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


		$scope.remove = function(id) {
			EmployeesService.delete().
  			success(function(data, status, headers, config) {
			    console.log(data);
			    alert("Employee successfully deleted. Redirecting to main page.");
				$window.location.assign("/employees");
			}).
			error(function(data, status, headers, config) {
			    console.log("an error occurred fetching employees")
			});

		};

		
		
	  
	});


RouteOpt.controller('algorithmController', function($scope, $window, EmployeesService) {
			
			$scope.computing = false;
			$scope.test = function() {
				$scope.computing=true;


				EmployeesService.getOptimizedSalespersonRoutes()
					.success(function(data, status, headers, config){
						console.log(data);
						$scope.computing = false;
					})
					.error(function(data, status, headers, config){
						console.log("Error getting optimized salesperson routes" + status);
						$scope.computing = false;
					});
			}

			
	});


RouteOpt.controller('uploadController', function($scope, $rootScope, Appointments, EmployeesService) {

	var geocoder = new google.maps.Geocoder();
	var Locations = [];

	$scope.uploadFile = "";
	
	$scope.fileType = "sales";
	$scope.uploading = false;
	$scope.uploadingComplete=false;

	$scope.csvJSON = function(csv){
		$scope.uploading=true; 

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
						else
						{
							console.log("found this address");
						}
						
						if(i<result.length)
						{

							setTimeout(storeGeo,1000);

						}
					})
					.error(function(data, status, headers, config) {
					    console.log("an error occurred looking for geocoded address");
					});	
			
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

		$scope.uploading = false;
		$scope.uploadingComplete = true;	
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


	$scope.noapp = false;
	Appointments.getSales().
		success(function(data, status, headers, config) {
			if(data.length > 0) {				
				$scope.appointments = data;
			} else {
				$scope.noapp = true;
			}
			
	}).
	error(function(data, status, headers, config) {
	    console.log("an error occurred fetching Appointments")
	});	
	

	$scope.headers = ["Appt Id", "Start Time", "End Time", "Opportunity #", "Customer Name", "Job Site"];
	$scope.noAppts = function() {
		//update later once appointments come from backend
		return $scope.noapp;
	};

  function getHeaders (appt) {
  	for (var i = 0; i < appt.length; i++) {
  		Things[i]
  	};
  };
	
});

RouteOpt.controller('viewResultsCtrl', function($scope, EmployeesService) {
	
	/*
	$scope.noroute = false;
	EmployeesServices.getOptimizedSalespersonRoutes().
		success(function(data, status, headers, config) {
			if(data.length > 0) {				
				$scope.optimizedRoutes = data;
			} else {
				$scope.noroute = true;
			}
			
	}).
	error(function(data, status, headers, config) {
	    console.log("an error occurred fetching Appointments")
	});	
	*/


	$scope.optimizedRoutes = 
		[ {
		   	appointmentList: 
		    [ 
		      { 'Appt Id': 764027,
		        'Start Time': '12:30:00 PM',
		        'End Time': '3:30:00 PM',
		        'Opportunity #': 'OPP1285229',
		        'Customer Name': 'John Doe',
		        'Job Site': '"3705 Meadow Dr, Rolling Meadows, IL , 60008"',
		      },
		      { 'Appt Id': 764886,
		        'Start Time': '3:30:00 PM',
		        'End Time': '6:30:00 PM',
		        'Opportunity #': 'OPP1285618',
		        'Customer Name': 'John Doe',
		        'Job Site': '"85 South St, Cary, IL, 60013"',
		      },
		      { 'Appt Id': 764708,
		        'Start Time': '6:30:00 PM',
		        'End Time': '9:30:00 PM',
		        'Opportunity #': 'OPP1285529',
		        'Customer Name': 'John Doe',
		        'Job Site': '"1508 Robincrest Ln, Lindenhurst, IL, 60046"',
		   	  },
			],
		   	employee: 
		    { name: 'Hinkley, Elizabeth A.',
		      address: '506 N. Center St',
		      type: 'Salesperson' } 
		  },

		 {
		   	appointmentList: 
		    [ 
		      { 'Appt Id': 764752,
		        'Start Time': '12:30:00 PM',
		        'End Time': '3:30:00 PM',
		        'Opportunity #': 'OPP1285555',
		        'Customer Name': 'John Doe',
		        'Job Site': '"1214 S Dunton Ave, Arlington Heights, IL , 60005"',
		      },
		      { 'Appt Id': 764325,
		        'Start Time': '3:30:00 PM',
		        'End Time': '6:30:00 PM',
		        'Opportunity #': 'OPP1285350',
		        'Customer Name': 'John Doe',
		        'Job Site': '"13 Westminster Ct, Lake in the Hills, IL, 60156"',
		      },
		      { 'Appt Id': 764269,
		        'Start Time': '6:30:00 PM',
		        'End Time': '9:30:00 PM',
		        'Opportunity #': 'OPP1285334',
		        'Customer Name': 'John Doe',
		        'Job Site': '"1111 Tewes Ln, Zion, IL, 60099"',
		      },
		    ],
		   employee: 
		    { name: 'Romnek, Michael E.',
		      address: '2400 E John St',
		      type: 'Salesperson' } 
		  },
		 
		 { 
		   appointmentList: 
		    [ 
		      { 'Appt Id': 764801,
		        'Start Time': '12:30:00 PM',
		        'End Time': '3:30:00 PM',
		        'Opportunity #': 'OPP1285574',
		        'Customer Name': 'John Doe',
		        'Job Site': '"9032 Mango Ave, Morton Grove, IL , 60053"',
		      },
		      { 'Appt Id': 764440,
		        'Start Time': '3:30:00 PM',
		        'End Time': '6:30:00 PM',
		        'Opportunity #': 'OPP1285384',
		        'Customer Name': 'John Doe',
		        'Job Site': '"309 N Rohlwing Rd, Palatine, IL, 60074"',
		      },
		      { 'Appt Id': 764659,
		        'Start Time': '6:30:00 PM',
		        'End Time': '9:30:00 PM',
		        'Opportunity #': 'OPP1285497',
		        'Customer Name': 'John Doe',
		        'Job Site': '"32605 Pilgrims Ct, Lakemoor, IL, 60051"',
		      },
		    ],
		   employee: 
		    { name: 'Stratton, Erik D.',
		      address: '4715 Turkey Trail',
		      type: 'Salesperson' }
		  }
		  ];


	$scope.findApptDetails = function(ids){
		//Whoever connects this to the backend should make a query to get the appointment
		//data based on the id

		$scope.employeeAppts = [{
		    "Appt Id":764563,
		    "Start Time":"6:30:00 PM",
		    "End Time":"9:30:00 PM",
		    "Opportunity #":"OPP1285439",
		    "Customer Name":"John Doe",
		    "Job Site":"1020 E Nichols RdUnit 4, Palatine, IL, 60074"
		  },
			{
		    "Appt Id":764998,
		    "Start Time":"12:30:00 PM",
		    "End Time":"3:30:00 PM",
		    "Opportunity #":"OPP1285686",
		    "Customer Name":"John Doe",
		    "Job Site":"1424 W Berwyn Ave2nd Floor, Chicago, IL, 60640"
		  }];

		return $scope.employeeAppts.sort(function (a, b) {
			if(a['Start Time'] < b['Start Time'])
				return -1;
			if(a['Start Time'] > b['Start Time'])
				return 1;
			return 0;
		});
		
	}
});



//This is needed to get the file name from the form input
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
