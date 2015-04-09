angular.module('Codegurukul', ['ngResource', 'ngMessages', 'ui.router', 'mgcrea.ngStrap', '720kb.socialshare','ngModal'])
  .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/free-ruby-workshop');
    
    $stateProvider
        .state('free-ruby-workshop', {
            url: '/free-ruby-workshop',
            templateUrl: 'views/free-ruby-workshop.html'
        })        
        .state('angularjs-workshop', {
            url: '/angularjs-workshop',
            templateUrl: 'views/angularjs-workshop.html'
        })        
        .state('contact', {
            url: '/contact',
            templateUrl: 'contact.html'
        })
        
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope, $q, $window, $location) {
      return {
        request: function(config) {
          if ($window.localStorage.token) {
            config.headers.Authorization = $window.localStorage.token;
          }
          return config;
        },
        responseError: function(response) {
          if (response.status === 401 || response.status === 403) {
            $location.path('/login');
          }
          return $q.reject(response);
        }
      }
    });
  });

  