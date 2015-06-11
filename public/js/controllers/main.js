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
				team: employee.team,
				type: employee.type
			});
			$scope.codeAddress(employee.address);
		};

		$scope.remove = function(id) {
			EmployeesService.delete(id);
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

	var geocoder;
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
		  geocoder = new google.maps.Geocoder();
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
	
	$scope.noroute = false;
	EmployeesService.getOptimizedSalespersonRoutes()
		.success(function(data, status, headers, config) {
			if(data.length > 0) {
				console.log("some data");
				console.log(data)
				$scope.optimizedRoutes = data;
			} else {
				$scope.noroute = true;
				console.log("no data");
			}
		})
		.error(function(data, status, headers, config) {
		    console.log("an error occurred fetching Appointments")
		});


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

RouteOpt.controller('AlgorithmUnitTest', function($scope) {
	$scope.testAlgorithm = function() {
		var appointments=[{
	        "Appt Id": 764752,
	        "Start Time": "12:30:00 PM",
	        "End Time": "3:30:00 PM",
	        "Opportunity #": "OPP1285555",
	        "Customer Name": "John Doe",
	        "Job Site": "\"1214 S Dunton Ave, Arlington Heights, IL , 60005\"",
	        "_id": {
	            "$oid": "556f6b3a639c060300ecafdf"
	        }
	    },
	    {
	        "Appt Id": 764440,
	        "Start Time": "3:30:00 PM",
	        "End Time": "6:30:00 PM",
	        "Opportunity #": "OPP1285384",
	        "Customer Name": "John Doe",
	        "Job Site": "\"309 N Rohlwing Rd, Palatine, IL, 60074\"",
	        "_id": {
	            "$oid": "556f6b3a639c060300ecafde"
	        }
	    },
	    {
	        "Appt Id": 764269,
	        "Start Time": "6:30:00 PM",
	        "End Time": "9:30:00 PM",
	        "Opportunity #": "OPP1285334",
	        "Customer Name": "John Doe",
	        "Job Site": "\"1111 Tewes Ln, Zion, IL, 60099\"",
	        "_id": {
	            "$oid": "556f6b3a639c060300ecafdd"
	    		}
	    }];


	  var geocodes = [{
		    "_id": {
		        "$oid": "55677a96b7e2f90300680934"
		    },
		    "address": "\"1214 S Dunton Ave, Arlington Heights, IL , 60005\"",
		    "coord": {
		        "lat": 42.061603,
		        "lon": -87.98269199999999
		    	},
		    "__v": 0
				},
				{
				    "_id": {
				        "$oid": "55677a98b7e2f90300680936"
				    },
				    "address": "\"309 N Rohlwing Rd, Palatine, IL, 60074\"",
				    "coord": {
				        "lat": 42.115912,
				        "lon": -88.02382499999999
				    },
				    "__v": 0
				},
			{
			    "_id": {
			        "$oid": "55677a93b7e2f90300680931"
			    },
			    "address": "\"1111 Tewes Ln, Zion, IL, 60099\"",
			    "coord": {
			        "lat": 42.421542,
			        "lon": -87.84364800000003
			    },
			    "__v": 0
			}];


		var employees = [{
		    "_id": {
		        "$oid": "55591ffae4b07b6ac504c419"
		    },
		    "name": "Tomaszewski, Thomas D.",
		    "address": "846 Lum Ave",
		    "city": "Waterloo",
		    "state": "WI",
		    "zip": 53594,
		    "team": "Green Bay",
		    "type": "Sales",
		    "coord": {
		        "lat": 43.19312,
		        "lon": -88.987017
		    }
		}];


		var nSalespeople = employees.length;
		var nAppointments = appointments.length;
		var nTotal = nSalespeople + nAppointments + 7; // +7 for the office locations

		var count=0;
		var aList=[
		{
			"name":"GreenBay",
			"address":"1125 Tuckaway Ln, Menasha, WI 54952",
			"coord":{"lat":44.2357938,"lon":-88.4239336}
		},
		{
			"name":"Madison",
			"address":"3037 S. Stoughton Rd, Madison, WI 53716",
			"coord":{"lat":43.05324,"lon":-89.307581}
		},
		{
			"name":"Milwaukee",
			"address":"5801 S. Pennsylvania Ave, Cudahy, WI 53110",
			"coord":{"lat":42.938382,"lon":-87.882969}
		},
		{
			"name":"Peoria",
			"address":"1401 West Glen, Peoria, IL 61614",
			"coord":{"lat":40.74777,"lon":-89.613891}
		},
		{
			"name":"Rockford",
			"address":"4322 Maray Drive, Rockford, IL 61108",
			"coord":{"lat":44.2357938,"lon":-89.031492}
		},
		{
			"name":"South",
			"address":"9932 S. Western Avenue, Chicago, IL 60643",
			"coord":{"lat":41.71269,"lon":-87.68216}
		},
		{
			"name":"North",
			"address":"125 E. Oakton, Des Plaines, IL 60018",
			"coord":{"lat":42.022436,"lon":-87.914881}
		}];


		for (i = 0; i < employees.length; i++)
		{
			var address = employees[i]["address"];
			// find the geocoded address for this appointment
			var found = false;
			for (var j = 0; j < geocodes.length; j++)
			{
				if (geocodes[j]["address"] == address)
				{
					found = true;
					employees[i]["coord"] = geocodes[j]["coord"];
					aList.push(employees[i]);
					break;
				}
			}
			if (!found) {
				aList.push(employees[i]);
			}
		}


		// insert coords into the appointments array
		// push into aList array
		for (i = 0; i < appointments.length; i++)
		{
			var address = appointments[i]["Job Site"];
			// find the geocoded address for this appointment
			var found = false;
			for (var j = 0; j < geocodes.length; j++)
			{
				if (geocodes[j]["address"] == address)
				{
					found = true;
					var newAppt = {};
					newAppt['coord'] = geocodes[j]['coord'];
					newAppt['Appt Id'] = appointments[i]['Appt Id'];
				  newAppt['Start Time'] = appointments[i]['Start Time'];
				  newAppt['End Time'] = appointments[i]['End Time'];
				  newAppt['Opportunity #'] = appointments[i]['Opportunity #'];
				  newAppt['Customer Name'] = appointments[i]['Customer Name'];
				  newAppt['Job Site'] = appointments[i]['Job Site'];
					aList.push(newAppt);
					break;
				}
			}
			if (!found) {
				// possibly geocode the address now?
			}
		}


		// initialize stuff needed for algorithm
		// office is node 0
		// saleperson homes are nodes 1 -> n + 1
		// customer locations are nodes n + 1 -> n + 1 + m
		var salespersonLocation = new Array(nSalespeople);
		var routes=new Array(nSalespeople);
		for(var i = 0; i < nSalespeople; i++)
		{
			routes[i]={};
			routes[i]["employee"] = employees[i];
			routes[i]["appointmentList"] = [];

			// the starting point is the office
			for (var j = 0; j < 6; j++)
			{
				if(employees[i].team == aList[j].name)
				{
					salespersonLocation[i] = j;
				}
			}
		}

		//an array of all man and address & location 
		var timeSlot=["12:30:00 PM","3:30:00 PM","6:30:00 PM"];
		for(var slot=0; slot<3; slot++){
			for (var k=0; k < nAppointments; k++)
			{
				if(appointments[k]["Start Time"]==timeSlot[slot]){
					count += 1;
				}
				if(count>=nSalespeople)
				{
					// notify the user that we don't have enough salespeople
					//console.log("throw an error here, not enough salespeople for the number of appointments");
					break;
				}
			}
			if (count<nSalespeople)
			{
				// change the time slot to false so we know that there wasn't enough appointments for all salespeople for this time slot
				// or that there were constraints so
				// timeSlot[slot] = false;
			}
			count=0;
		}


		// distance matrix

		var distanceMatrix = new Array(nTotal);
		for (var i = 0; i < nTotal; i++)
		{
	  	distanceMatrix[i] = new Array(nTotal);
		}

		// fill distance matrix with garbage
		for (var i = 0; i < nTotal; i++)
		{
			// half of the matrix is same as the other half
			for (var j = 0; j <= i; j++)
			{
				if (i == j)
				{
					// nodes distance to itself is 0
					distanceMatrix[i][j] = 0;
				}
				else
				{
					if (!aList[i].coord)
					{
	  				var bleh = JSON.parse(aList[i]);
						console.log(bleh.coord);
					}
					// this is where we will call calculateDistance
					var dist = calculateDistance(aList[i].coord.lat,
																			 aList[j].coord.lat,
																			 aList[i].coord.lon,
																			 aList[j].coord.lon);
					distanceMatrix[i][j] = dist;
					distanceMatrix[j][i] = dist;
				}
				
			}
		}

		var visited = new Array(nAppointments); // only need to mark customer nodes as visited
		for (var i = 0; i < nAppointments; i++)
		{
			visited[i] = false; // nothing is visited
		}

		// for each time slot
		for(var appointment=0; appointment < 3; appointment++)
		{
			// for each salesman
			for(var salesperson = 0; salesperson < nSalespeople; salesperson++)
			{
				// translate to location in distance matrix
				var translatedSalespersonIdx = salesperson + 1;
				
				// origin does not need translated
				var origin = salespersonLocation[salesperson];//from last point
				var minDistance = Infinity;
				var bestDest = null;
				var bestTranslatedDest = null;
				
				// for each customer destination
				for(var dest = 0; dest < nAppointments; dest++)
				{
					// translate to location in distance matrix
					var translatedDestIdx = dest + nSalespeople + 1;
					// get distance from distance matrix
					var distance = distanceMatrix[translatedSalespersonIdx][translatedDestIdx];
					var time = aList[translatedSalespersonIdx+7]["Start Time"];
					

					if (distance < minDistance && !visited[dest] && timeSlot[appointment] == time)
					{
						minDistance = distance;
						bestTranslatedDest = translatedDestIdx;
						bestDest = dest;
					}
				}

				if (bestTranslatedDest) {
					routes[salesperson]["appointmentList"].push(aList[bestTranslatedDest]);
					visited[bestDest] = true;
					salespersonLocation[salesperson] = bestTranslatedDest;
				}
				else 
				{
					//console.log("something went wrong: ", bestTranslatedDest);
				}
			}
		}
		console.log("routes: ", routes);

		$scope.optimizedRoutes = routes;
		$scope.nSalespeople = nSalespeople;
		$scope.nAppointments = nAppointments;
		$scope.aList = aList;
		$scope.distanceMatrix = distanceMatrix;
	}

	var EARTH_RADIUS = 6378137.0;

	var getRad = function(d){
		return d*Math.PI/180.0;
	}

	var calculateDistance = function(lat1,lat2,lng1,lng2) {

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
