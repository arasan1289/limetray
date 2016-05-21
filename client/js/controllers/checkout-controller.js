angular.module('assignment')
  .controller('checkoutController', function ($scope, $stateParams, $state, $mdDialog, cartFactory, $mdToast) {
    if (!$stateParams.products) {
      $state.go('home');
    }
    $scope.orderReceived = false;
    $scope.products = $stateParams.products;
    $scope.calculatePrice = function (price, qty) {
      return parseFloat(price) * qty;
    };
    $scope.incrementQty = function (product) {
      product.purchasedQuantity++;
    };
    $scope.decrementQty = function (product) {
      if (product.purchasedQuantity != 1) {
        product.purchasedQuantity--;
      }
    };
    $scope.removeProduct = function (products, index) {
      products.splice(index, 1);
    };
    $scope.calculateSubTotal = function (products) {
      var tot = products.reduce(function (pv, cv) {
        return pv + parseFloat(cv.price) * cv.purchasedQuantity;
      }, 0);
      return tot;
    };
    $scope.calculateTax = function (products) {
      var tot = products.reduce(function (pv, cv) {
        return pv + parseFloat(cv.price) * cv.purchasedQuantity;
      }, 0);
      return tot * (14.5 / 100);
    };
    $scope.calculateGrandTotal = function (products) {
      var tot = products.reduce(function (pv, cv) {
        return pv + parseFloat(cv.price) * cv.purchasedQuantity;
      }, 0);
      return tot + tot * (14.5 / 100);
    };
    $scope.loginModal = function (ev, productOrder) {
      var data = {
        orderSubTotal: $scope.calculateSubTotal(productOrder),
        orderTaxAmount: $scope.calculateTax(productOrder),
        orderGrandTotal: $scope.calculateGrandTotal(productOrder),
        productsOrdered: productOrder
      };
      cartFactory.setProducts(data);
      $mdDialog.show({
        controller: 'loginModalController',
        templateUrl: '/partials/login-modal.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      }).then(function (answer) {
        cartFactory.sendOrder(data).then(function (oRes) {
          $scope.orderReceived = true;
          $scope.orderDetails = oRes.data.orderId;
        }, function () {
          $mdToast.show(
            $mdToast.simple()
              .textContent('File Could not be saved')
              .position('top')
              .hideDelay(3000)
          );
        });
      }, function () {
        $scope.orderReceived = false;
      });
    }
  });