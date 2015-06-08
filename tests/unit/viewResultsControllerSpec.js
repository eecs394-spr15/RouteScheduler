describe('uploadController', function() {
  beforeEach(module('RouteOptimizer'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.csvJSON', function() {
    it('sets the strength to "strong" if the password length is >8 chars', function() {
      var $scope = {};
      var controller = $controller('uploadController', { $scope: $scope });
      $scope.password = 'test';
      expect($scope.password).toEqual('test');
    });
  });
});