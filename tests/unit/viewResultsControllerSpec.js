describe('uploadController', function() {
  beforeEach(module('RouteOptimizer'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('geocode',function(){
    it('gives geocoding result', function(){
      var $scope = {};
      var controller = $controller('addEmployeeController', { $scope: $scope });
      $scope.geo=$scope.unittest();
      expect($scope.geo).toBe('333');
    });
  });

  
});
