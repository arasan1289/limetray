angular.module('assignment')
  .controller('loginModalController', function ($scope, $mdDialog, cartFactory, $mdToast, $state) {
    $scope.user = {email: '', password: ''};
    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };
    $scope.login = function (user) {
      cartFactory.login(user).then(function (lRes) {
        $mdDialog.hide(lRes.data);
      }, function () {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Incorrect Credentials')
            .position('top')
            .hideDelay(3000)
        );
      })
    };
  });