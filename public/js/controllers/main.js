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
RouteOpt.controller('employeeController', function($scope, EmployeesService) {
		
		EmployeesService.create({
			name: 'John Smith',
			address: '123 Blah St',
			type: 'Technician'
		});
		
		console.log("bleh");
		$scope.formData = {};
		$scope.loading = true;
		
		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos

	});

RouteOpt.controller('uploadController', function($scope) {		
		$scope.uploadFile = "lsls";
		$scope.getFile = function() {
			$scope.fileName = $scope.fileName;
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