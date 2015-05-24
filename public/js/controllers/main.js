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

RouteOpt.controller('uploadController', function($scope, $rootScope, Appointments) {

	
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
			  
			  Appointments.addSales(JSON.stringify(result));

			  //return result; //JavaScript object
			  console.log(JSON.stringify(result)); //JSON

			  console.log("finished parsing");			  
			  
			}

			reader.readAsText($scope.uploadFile);

		}

			
	});

RouteOpt.controller('viewAppointmentsCtrl', function($scope, $rootScope, Appointments) {


	Appointments.getSales().
		success(function(data, status, headers, config) {
			$scope.appointments = data;
	}).
	error(function(data, status, headers, config) {
	    console.log("an error occurred fetching Appointments")
	});	
	

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

