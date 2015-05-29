angular.module('Codegurukul')
    .controller('LandingCtrl', function($scope, $rootScope, Courses, $stateParams, $location) {

    Courses.getAll.get({
        cslug: "web-internship-program"
    }, function(data) {
        $scope.course = data.course;
    });


});