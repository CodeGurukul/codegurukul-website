angular.module('Codegurukul')
    .controller('AdminCourseDetailsCtrl', function($scope, $alert, $rootScope, Admin, $stateParams) {

    Admin.attendees.get({
        cslug: $stateParams.course,
        sid: $stateParams.slot
    }, function(data) {
        $scope.attendees = data.attendees;
        console.log($scope.attendees);
    });

    $scope.sortType = '_id.profile.fullname';
    $scope.sortReverse = false;
    $scope.searchAttendee = '';

});