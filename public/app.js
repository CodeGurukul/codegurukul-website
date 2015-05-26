angular.module('Codegurukul', ['ngResource', 'ngMessages', 'ui.router', 'mgcrea.ngStrap', '720kb.socialshare','ngModal', 'uiGmapgoogle-maps','angular-carousel', 'ngSanitize', 'ngTagsInput','720kb.tooltips'])
    .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('programs', {
        url: '/programs/:course',
        templateUrl: 'views/program-details.html',
        controller: 'ProgramCtrl'
    }) 
        .state('user', {
        url: '/user/:uslug',
        templateUrl: 'views/user-profile.html',
        controller: 'UserCtrl'
    })  
        .state('admin', {
        url: '/admin',
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
    })
        .state('admin-add-course', {
        url: '/admin/add-course',
        templateUrl: 'views/admin-add-course.html'
//        controller: 'AdminCourseDetailsCtrl'
    }) 
        .state('admin-course-details', {
        url: '/admin/view/:course',
        templateUrl: 'views/admin-view-course-details.html',
        controller: 'AdminCourseDetailsCtrl'
    }) 
        .state('verify-email', {
        url: '/verify-email',
        templateUrl: 'views/email-verification.html',
        controller: 'VerifyEmailCtrl'
    })  
        .state('verification', {
        url: '/userverification/:verificationCode',
        templateUrl: 'views/verification.html',
        controller: 'VerificationCtrl'
    })  
        .state('home', {
        url: '/',
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
        .state('stories', {
        url: '/stories',
        templateUrl: 'views/stories.html'
    })        
        .state('about-us', {
        url: '/about-us',
        templateUrl: 'views/about-us.html'
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



