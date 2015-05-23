var RouteOpt = angular.module('RouteOptimizer', []);
RouteOpt.service('EmployeesService', ['$http',function($http) {
		this.get = function() {
			return $http.get('/api/employees');
		};

		this.create = function(data) {
			return $http.post('/api/employees', data);
		};

		this.delete = function(id) {
			return $http.delete('/api/employees/' + id);
		};
	}])
	// inject the Todo service factory into our controller


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

		$scope.test = function() {
			EmployeesService.get().
  			success(function(data, status, headers, config) {
			    console.log(data);
			  }).
			  error(function(data, status, headers, config) {
			    console.log("an error occurred fetching employees")
			  });
		}		

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
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

RouteOpt.controller('uploadController', function($scope, $rootScope) {

	
		$scope.uploadFile = "";
		
		$scope.fileType = "sales";

		$scope.csvJSON = function(csv){ 
		  
			var reader = new FileReader();

			reader.onload = function(evt) {
				console.log("parse started");
			  
			  var csv = this.result;
			  //console.log(csv);
			  var lines = csv.split("\n");
 
			  var result = [];
			 
			  var headers = lines[0].match(/(?:[^,"\r]+|"[^"]*")+/g);
				
						 	

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
			  
			  //return result; //JavaScript object
			  console.log(JSON.stringify(result)); //JSON

			  console.log("finished parsing");			  
			  
			}

			reader.readAsText($scope.uploadFile);

		}

			
	});

RouteOpt.controller('viewAppointmentsCtrl', function($scope, $rootScope) {
	$scope.appointments = [
		  {
		    "Appt. Id":764563,
		    "Start Time":"6:30:00 PM",
		    "End Time":"9:30:00 PM",
		    "Opportunity #":"OPP1285439",
		    "Customer Name":"John Doe",
		    "Job Site":"1020 E Nichols RdUnit 4, Palatine, IL, 60074"
		  },
		  {
		    "Appt. Id":764659,
		    "Start Time":"6:30:00 PM",
		    "End Time":"9:30:00 PM",
		    "Opportunity #":"OPP1285497",
		    "Customer Name":"John Doe",
		    "Job Site":"32605 Pilgrims Ct, Lakemoor, IL, 60051"
		  },
		  {
		    "Appt. Id":762702,
		    "Start Time":"6:30:00 PM",
		    "End Time":"9:30:00 PM",
		    "Opportunity #":"OPP1284632",
		    "Customer Name":"John Doe",
		    "Job Site":"1747 Paddington Ave, Naperville, IL, 60563"
		  },
		  {
		    "Appt. Id":764801,
		    "Start Time":"12:30:00 PM",
		    "End Time":"3:30:00 PM",
		    "Opportunity #":"OPP1285574",
		    "Customer Name":"John Doe",
		    "Job Site":"9032 Mango Ave, Morton Grove, IL , 60053"
		  },
		  {
		    "Appt. Id":764691,
		    "Start Time":"12:30:00 PM",
		    "End Time":"3:30:00 PM",
		    "Opportunity #":"OPP1285520",
		    "Customer Name":"John Doe",
		    "Job Site":"3543 N Hamilton Ave, Chicago, IL, 60618"
		  },
		  {
		    "Appt. Id":764312,
		    "Start Time":"3:30:00 PM",
		    "End Time":"6:30:00 PM",
		    "Opportunity #":"OPP1285343",
		    "Customer Name":"John Doe",
		    "Job Site":"1735 N Talman Ave, Chicago, IL , 60647"
		  },
		  {
		    "Appt. Id":762692,
		    "Start Time":"6:30:00 PM",
		    "End Time":"9:30:00 PM",
		    "Opportunity #":"OPP1283977",
		    "Customer Name":"John Doe",
		    "Job Site":"2232 Stowe Cir, Naperville, IL, 60564"
		  },
		  {
		    "Appt. Id":764708,
		    "Start Time":"6:30:00 PM",
		    "End Time":"9:30:00 PM",
		    "Opportunity #":"OPP1285529",
		    "Customer Name":"John Doe",
		    "Job Site":"1508 Robincrest Ln, Lindenhurst, IL, 60046"
		  },
		  {
		    "Appt. Id":764269,
		    "Start Time":"6:30:00 PM",
		    "End Time":"9:30:00 PM",
		    "Opportunity #":"OPP1285334",
		    "Customer Name":"John Doe",
		    "Job Site":"1111 Tewes Ln, Zion, IL, 60099"
		  },
		  {
		    "Appt. Id":764027,
		    "Start Time":"12:30:00 PM",
		    "End Time":"3:30:00 PM",
		    "Opportunity #":"OPP1285229",
		    "Customer Name":"John Doe",
		    "Job Site":"3705 Meadow Dr, Rolling Meadows, IL , 60008"
		  },
		  {
		    "Appt. Id":764079,
		    "Start Time":"3:30:00 PM",
		    "End Time":"6:30:00 PM",
		    "Opportunity #":"OPP1285256",
		    "Customer Name":"John Doe",
		    "Job Site":"4950 W Kinzie St, Chicago, IL , 60644"
		  },
		  {
		    "Appt. Id":764752,
		    "Start Time":"12:30:00 PM",
		    "End Time":"3:30:00 PM",
		    "Opportunity #":"OPP1285555",
		    "Customer Name":"John Doe",
		    "Job Site":"1214 S Dunton Ave, Arlington Heights, IL , 60005"
		  },
		  {
		    "Appt. Id":764616,
		    "Start Time":"6:30:00 PM",
		    "End Time":"9:30:00 PM",
		    "Opportunity #":"OPP1285470",
		    "Customer Name":"John Doe",
		    "Job Site":"4401 Lyons, Skokie, IL, 60076"
		  },
		  {
		    "Appt. Id":764440,
		    "Start Time":"3:30:00 PM",
		    "End Time":"6:30:00 PM",
		    "Opportunity #":"OPP1285384",
		    "Customer Name":"John Doe",
		    "Job Site":"309 N Rohlwing Rd, Palatine, IL, 60074"
		  },
		  {
		    "Appt. Id":764998,
		    "Start Time":"12:30:00 PM",
		    "End Time":"3:30:00 PM",
		    "Opportunity #":"OPP1285686",
		    "Customer Name":"John Doe",
		    "Job Site":"1424 W Berwyn Ave2nd Floor, Chicago, IL, 60640"
		  },
		  {
		    "Appt. Id":763824,
		    "Start Time":"3:30:00 PM",
		    "End Time":"6:30:00 PM",
		    "Opportunity #":"OPP1285133",
		    "Customer Name":"John Doe",
		    "Job Site":"10S315 Havens Dr, Downers Grove, IL, 60516"
		  },
		  {
		    "Appt. Id":764559,
		    "Start Time":"3:30:00 PM",
		    "End Time":"6:30:00 PM",
		    "Opportunity #":"OPP1285438",
		    "Customer Name":"John Doe",
		    "Job Site":"1013 Sommerset CtApt C, Elgin, IL, 60120"
		  },
		  {
		    "Appt. Id":764814,
		    "Start Time":"6:30:00 PM",
		    "End Time":"9:30:00 PM",
		    "Opportunity #":"OPP1285581",
		    "Customer Name":"John Doe",
		    "Job Site":"206 Sunshine Dr, Bolingbrook, IL, 60490"
		  },
		  {
		    "Appt. Id":764641,
		    "Start Time":"3:30:00 PM",
		    "End Time":"6:30:00 PM",
		    "Opportunity #":"OPP1285491",
		    "Customer Name":"John Doe",
		    "Job Site":"824 N Monticello Ave, Chicago, IL, 60651"
		  },
		  {
		    "Appt. Id":764855,
		    "Start Time":"12:30:00 PM",
		    "End Time":"3:30:00 PM",
		    "Opportunity #":"OPP1285598",
		    "Customer Name":"John Doe",
		    "Job Site":"2239 W Polk St, Chicago, IL , 60612"
		  },
		  {
		    "Appt. Id":765031,
		    "Start Time":"12:30:00 PM",
		    "End Time":"3:30:00 PM",
		    "Opportunity #":"OPP1285710",
		    "Customer Name":"John Doe",
		    "Job Site":"6441 N Claremont Ave, Chicago, IL , 60645"
		  },
		  {
		    "Appt. Id":764699,
		    "Start Time":"12:30:00 PM",
		    "End Time":"3:30:00 PM",
		    "Opportunity #":"OPP1285523",
		    "Customer Name":"John Doe",
		    "Job Site":"1440 Briergate Dr, Naperville, IL, 60563"
		  },
		  {
		    "Appt. Id":764886,
		    "Start Time":"3:30:00 PM",
		    "End Time":"6:30:00 PM",
		    "Opportunity #":"OPP1285618",
		    "Customer Name":"John Doe",
		    "Job Site":"85 South St, Cary, IL, 60013"
		  },
		  {
		    "Appt. Id":764631,
		    "Start Time":"6:30:00 PM",
		    "End Time":"9:30:00 PM",
		    "Opportunity #":"OPP1285482",
		    "Customer Name":"John Doe",
		    "Job Site":"1248 S 19th Ave, Maywood, IL, 60153"
		  }];

	$scope.headers = ["Appt. Id", "Start Time", "End Time", "Opportunity #", "Customer Name", "Job Site"];
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

/*var updateFileName = function(evt) {
		console.log("change registered");
		console.log("file name: ", document.getElementById("fileN").files[0].name);
};*/

