angular.module('Codegurukul')
    .controller('AdminCourseDetailsCtrl', function($scope, $alert, $rootScope, Admin, $stateParams) {
    console.log($stateParams.course + "course");

    Admin.attendees.get({
        cslug: $stateParams.course

    }, function(data) {
        $scope.attendees = data.attendees;
        console.log($scope.attendees);
    });

});