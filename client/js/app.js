'use strict';
angular.module('assignment', ['ngMessages', 'ngAria', 'ngResource', 'ngAnimate', 'ui.router', 'ngMaterial', 'angular.filter'])
  .config(function ($stateProvider, $urlRouterProvider, $mdIconProvider) {
    $mdIconProvider.defaultIconSet('/css/mdi.svg');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/partials/home.html',
        controller: 'listItemsController'
      })
      .state('checkout', {
        url: '/checkout',
        templateUrl: '/partials/checkout.html',
        controller: 'checkoutController',
        params: {products: null}
      })
      .state('confirmation', {
        url: '/confirmation',
        templateUrl: '/partials/confirmation.html',
        controller: 'confirmationController',
        resolve: {
          products: function (cartFactory) {
            return cartFactory.getProducts();
          },
          orderId: function (cartFactory, products) {
            return cartFactory.sendOrder(products).then(function (res) {
              return res.data.orderId;
            });
          }
        }
      });
    $urlRouterProvider.when('', '/home');
    $urlRouterProvider.when('/', '/home');

    // always goto 404 if route not found
  });