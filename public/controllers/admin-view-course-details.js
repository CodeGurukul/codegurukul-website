angular.module('Codegurukul')
    .controller('AdminCourseDetailsCtrl', function($scope, $alert, $rootScope, Courses, $stateParams) {


    Courses.getAll.get({
        cslug: $stateParams.course

    }, function(data) {
        $scope.course = data.course;
        console.log($scope.course.attendees);
    });

});