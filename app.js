angular.module('Codegurukul', ['ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap', '720kb.socialshare','ngModal'])
  .config(function ($routeProvider, $locationProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/programs', {
        templateUrl: 'views/programs.html'
      })
      .when('/program/:pslug', {
        templateUrl: 'views/programDetail.html',
        controller: 'ProgramCtrl'
      })
      .when('/worskshops/internships', {
        templateUrl: 'views/internships.html',
        controller: 'InternshipsCtrl'
      })
      .when('/worskshops/angularjs', {
        templateUrl: 'views/angularjs.html',
        controller: 'HomeCtrl'
      })
      .when('/worskshops/rubyonrails', {
        templateUrl: 'views/rubyonrails.html',
        controller: 'HomeCtrl'
      })
      .when('/testimonials', {
        templateUrl: 'views/testimonials.html',
        controller: 'HomeCtrl'
      })
      .when('/camps', {
        templateUrl: 'views/camps.html'
      })
      .when('/about', {
        templateUrl: 'views/about-us.html'
      })
      .when('/contact', {
        templateUrl: 'views/contact-us.html'
      })
      .when('/faq', {
        templateUrl: 'views/faq.html'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
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

  