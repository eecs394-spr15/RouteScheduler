describe('uploadController', function() {
  beforeEach(module('RouteOptimizer'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('salesperson algorithm', function() {
    // load the controller before each
    it('does not assign more than 3 appointments to any salesperson', function() {
      var $scope = {};
      var controller = $controller('AlgorithmUnitTest', { $scope: $scope });
      var testFailed = false;

      $scope.testAlgorithm();

      for (var i = 0; i < $scope.optimizedRoutes.length; i++) {
        if ($scope.optimizedRoutes[i].appointmentList.length > 3) {
          testFailed = true;
        }
      }

      expect(testFailed).toBe(false);
    });

    it('never assigns the same appointment to multiple salespeople', function() {
      var $scope = {};
      var controller = $controller('AlgorithmUnitTest', { $scope: $scope });
      var testFailed = false;

      $scope.testAlgorithm();

      // loop through all appointment combinations
      for (var i = 0; i < $scope.optimizedRoutes.length; i++) {
        for (var ii = 0; ii < $scope.optimizedRoutes[i].appointmentList.length; ii++) {
          for (var j = 0; j < $scope.optimizedRoutes.length; j++) {
            for (var jj = 0; jj < $scope.optimizedRoutes[j].appointmentList.length; jj++) {
              if (i != j && ii != jj) {
                if ($scope.optimizedRoutes[i].appointmentList[ii]['Appt Id'] == $scope.optimizedRoutes[j].appointmentList[jj]['Appt Id']) {
                  testFailed = true;
                }
              }
            }
          }
        }
      }

      expect(testFailed).toBe(false);
    });
  });
});