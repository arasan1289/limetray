angular.module('assignment')
  .factory('cartFactory', function ($http, $window) {
    var service = {}, products;
    service.getItems = function () {
      return $http.get('/api/items');
    };
    service.login = function (user) {
      return $http.post('/api/login', user);
    };
    service.sendOrder = function (order) {
      return $http.post('/api/order', order);
    };
    service.setProducts = function (data) {
      $window.sessionStorage.products = JSON.stringify(data);
    };
    service.getProducts = function () {
      return JSON.parse($window.sessionStorage.getItem('products'));
    };
    return service;
  });