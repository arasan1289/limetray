angular.module('assignment')
  .controller('confirmationController', function ($scope, products, orderId) {
    $scope.products = products;
    $scope.orderId = orderId;
    $scope.calculatePrice = function (price, qty) {
      return parseFloat(price) * qty;
    };
  });