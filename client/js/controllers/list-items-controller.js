angular.module('assignment')
  .controller('listItemsController', function ($scope, cartFactory, $state) {
    $scope.purchasedProducts = [];
    cartFactory.getItems().then(function (res) {
      $scope.products = [];
      res.data.forEach(function (p) {
        p.showList = true;
        this.push(p)
      }, $scope.products);
      $scope.sortingLinks = [{name: 'Price (High To Low)', _reverse: true}, {
        name: 'Price Low TO High',
        _reverse: false
      }];
      $scope.selected = 'Price (High To Low)';
      $scope.select = function (item) {
        $scope.selected = item.name;
        $scope.reverse = item._reverse;
      };
      $scope.isActive = function (item) {
        return $scope.selected === item.name;
      };
      $scope.predicate = 'price';
      $scope.reverse = true;
      $scope.order = function (predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
      };
    });
    $scope.addToCart = function (purchasedProducts, product, products) {
      product.purchasedQuantity = 1;
      purchasedProducts.push(product);
      var pr = [];
      products.forEach(function (p) {
        if (p.SKUCode === product.SKUCode) {
          p.showList = false;
        }
      }, pr);
      products = pr;
    };
    $scope.removeFromCart = function (purchasedProducts, product, products, index) {
      products.forEach(function (p) {
        if (p.SKUCode === product.SKUCode) {
          p.showList = true;
        }
        purchasedProducts.splice(index, 1);
      })
    };
    $scope.checkout = function (purchasedProducts) {
      $state.go('checkout', {products: purchasedProducts});
    };
    var checkProduct = function (product, purchasedProducts) {
      var ret;
      if (purchasedProducts.length > 0) {
        purchasedProducts.forEach(function (p) {
          ret = !(p.SKUCode === product.SKUCode)
        });
      } else {
        ret = true;
      }
      return ret;
    };
    $scope.reorderList = function (products, purchasedProducts, key) {
      products.forEach(function (p) {
        console.log(checkProduct(p, purchasedProducts));
        if (key === 'All') {
          p.showList = checkProduct(p, purchasedProducts);
        } else if (p.category === key) {
          p.showList = checkProduct(p, purchasedProducts);
        } else {
          p.showList = false;
        }
      });
    };
  });