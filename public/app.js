angular.module('Codegurukul', ['ngResource', 'ngMessages', 'ui.router', 'mgcrea.ngStrap', '720kb.socialshare','ngModal', 'ngSanitize','ngTagsInput','720kb.tooltips','validation.match','slick'])
    .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('programs', {
        url: '/programs/:course',
        templateUrl: 'views/program-details.html',
        controller: 'ProgramCtrl'
    }) 
        .state('wip', {
        url: '/wip',
        templateUrl: 'views/redirect.html',
        controller: function ($stateParams, $state) {
            $state.go('programs', {course:'web-internship-program'});
        }
    }) 
        .state('user', {
        url: '/user/:uslug',
        templateUrl: 'views/user-profile.html',
        controller: 'UserCtrl'
    })  
        .state('admin-all-courses', {
        url: '/admin/courses',
        templateUrl: 'views/admin-all-courses.html',
        controller: 'AdminCoursesCtrl'
    })  
        .state('admin-all-users', {
        url: '/admin/users',
        templateUrl: 'views/admin-all-users.html',
        controller: 'AdminUsersCtrl'
    })
        .state('admin-edit-course', {
        url: '/admin/edit-course/:course',
        templateUrl: 'views/admin-edit-course.html',
        controller: 'AdminEditCourseCtrl'
    }) 
        .state('admin-course-details', {
        url: '/admin/view/:course/:slot',
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
        .state('terms-and-conditions', {
        url: '/terms-and-conditions',
        templateUrl: 'views/terms-and-conditions.html'
    })  
        .state('refund-policy', {
        url: '/refund-policy',
        templateUrl: 'views/refund-policy.html'
    })  
        .state('privacy-policy', {
        url: '/privacy-policy',
        templateUrl: 'views/privacy-policy.html'
    })  
        .state('home', {
        url: '/',
        templateUrl: 'views/landing.html',
        controller: 'LandingCtrl'
    })     
        .state('contact', {
        url: '/contact',
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
    })            
        .state('partner-with-us', {
        url: '/partner-with-us',
        templateUrl: 'views/partner-with-us.html',
        controller: 'ContactCtrl'
    })            
        .state('be-a-mentor', {
        url: '/be-a-mentor',
        templateUrl: 'views/be-a-mentor.html',
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
//        .state('payment', {
//        url: "/payment",
//        templateUrl: "payment.html"
//    })
        .state('success', {
        url: '/success',
        templateUrl: 'views/payment-success.html'
    })
        .state('failure', {
        url: '/failure',
        templateUrl: 'views/payment-failure.html'
    })
        .state('cancelled', {
        url: '/cancelled',
        templateUrl: 'views/payment-cancelled.html'
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
                if (response.status === 404) {
                    $location.path('home');
                }
                return $q.reject(response);
            }
        }
    });
});

//
//    .config(function(uiGmapGoogleMapApiProvider) {
//    uiGmapGoogleMapApiProvider.configure({
//        key: 'AIzaSyDMvVbBJWCPE5VjC7EQPo1ohZj8hu17FXg',
//        v: '3.17',
//        libraries: 'weather,geometry,visualization'
//    });
//});



