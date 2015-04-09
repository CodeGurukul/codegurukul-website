angular.module('Codegurukul', ['ngResource', 'ngMessages', 'ui.router', 'mgcrea.ngStrap', '720kb.socialshare','ngModal', 'uiGmapgoogle-maps'])
  .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/free-ruby-workshop');
    
    $stateProvider
        .state('free-ruby-workshop', {
            url: '/free-ruby-workshop',
            templateUrl: 'views/free-ruby-workshop.html',
            controller: 'RubyCtrl'
       })        
        .state('angularjs-workshop', {
            url: '/angularjs-workshop',
            templateUrl: 'views/angularjs-workshop.html',
            controller: 'AngularjsCtrl'
        })           
        .state('home', {
            url: '/free-ruby-workshop',
            templateUrl: 'views/free-ruby-workshop.html'
        })        
        .state('contact', {
            url: '/contact',
            templateUrl: 'views/contact.html',
            controller: 'ContactCtrl'
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
  })


.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyDMvVbBJWCPE5VjC7EQPo1ohZj8hu17FXg',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});



  