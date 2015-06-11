describe('uploadController', function() {
  beforeEach(module('RouteOptimizer'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('salesperson algorithm', function() {
    // load the controller before each
    it('length of aList should equal to the sum of office location, number of sales and number of appointments', function() {
      var $scope = {};
      var controller = $controller('AlgorithmUnitTest', { $scope: $scope });
      var testFailed = false;

      $scope.testAlgorithm();

      if ($scope.aList.length != (7 + $scope.nSalespeople + $scope.nAppointments)) {
          testFailed = true;
      }
      expect(testFailed).toBe(false);

    });

    it('all of the addresses should have corresponding coordinates', function() {
      var $scope = {};
      var controller = $controller('AlgorithmUnitTest', { $scope: $scope });
      var testFailed = false;

      $scope.testAlgorithm();

      // loop through all appointment combinations
      for (var i = 0; i < $scope.aList.length; i++) {
        if($scope.aList[i].coord.lat == null || $scope.aList[i].coord.lat == null)
          testFailed = true;
      }

      expect(testFailed).toBe(false);
    });

    it('every distance between two locations should not be 0', function() {
      var $scope = {};
      var controller = $controller('AlgorithmUnitTest', { $scope: $scope });
      var testFailed = false;

      $scope.testAlgorithm();

      // loop through all appointment combinations
      for (var i = 0; i < (7 + $scope.nSalespeople + $scope.nAppointments); i++) {
        // only half of the matrix is filled
        for (var j = 0; j <= i; j++)
        {
          if (i != j && $scope.distanceMatrix[i][j] == 0)
          {
            testFailed = true;
          }
        }
      }
      expect(testFailed).toBe(false);
    });


  });
});