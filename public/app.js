angular.module('Codegurukul', ['ngResource', 'ngMessages', 'ui.router', 'mgcrea.ngStrap', '720kb.socialshare','ngModal', 'uiGmapgoogle-maps','angular-carousel', 'ngSanitize', 'ngTagsInput'])
    .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/angularjs-workshop');

    $stateProvider
        .state('programs', {
        url: '/programs/:course',
        templateUrl: 'views/program-details.html',
        controller: 'ProgramCtrl'
    }) 
    //        .state('free-ruby-workshop', {
    //        url: '/free-ruby-workshop',
    //        templateUrl: 'views/free-ruby-workshop.html',
    //        controller: 'RubyCtrl'
    //    })        
        .state('user', {
        url: '/user/:uslug',
        templateUrl: 'views/user-profile.html',
        controller: 'UserCtrl'
    })
        .state('home', {
        url: '/angularjs-workshop',
        templateUrl: 'views/angularjs-workshop.html'
    })    
        .state('landing', {
        url: '/landing-page',
        templateUrl: 'views/landing.html',
        controller: 'LandingCtrl'
    })        
        .state('angularjs-workshop', {
        url: '/angularjs-workshop',
        templateUrl: 'views/angularjs-workshop.html',
        controller: 'AngularjsCtrl'
    })          
        .state('internships', {
        url: '/internships',
        templateUrl: 'views/internships.html',
        controller: 'InternshipsCtrl'
    })           
        .state('contact', {
        url: '/contact',
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
    })        
        .state('startup-team-training', {
        url: '/startup-team-training',
        templateUrl: 'views/startup-team-training.html',
        controller: 'StartupCtrl'
    })        
        .state('fresher-to-hacker', {
        url: '/fresher-to-hacker',
        templateUrl: 'views/fresher-to-hacker.html',
        controller: 'FresherToHackerCtrl'
    })           
        .state('mentors', {
        url: '/mentors',
        templateUrl: 'views/mentors.html'
    })       
        .state('all-courses', {
        url: '/all-courses',
        templateUrl: 'views/all-courses.html',
        controller: 'AllCoursesCtrl'
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
                if (response.status === 404) {
                    $location.path('home');
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



