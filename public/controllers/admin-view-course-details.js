angular.module('Codegurukul')
    .controller('AdminCourseDetailsCtrl', function($scope, $alert, $rootScope, Admin, $stateParams, $state) {

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

    $scope.adminAddAttendeeModalShown = false;

    $scope.adminAddAttendeeModal = function(){
        $scope.adminAddAttendeeModalShown = !$scope.adminAddAttendeeModalShown;
    }

    $scope.addAttendee = function(){
        console.log($scope.fullname+" fullname" + $scope.username+" username"+ $scope.email+" email"+$scope.mobile+" mobile"+$scope.mop+" mop"+$scope.amount);
        Admin.addAttendee.save({
            cslug: $stateParams.course,
            sid: $stateParams.slot,
            fullname: $scope.fullname,
            username: $scope.username,
            email: $scope.email,
            mobile: $scope.mobile,
            mop: $scope.mop,
            amount: $scope.amount
        },function(data){
            $scope.adminAddAttendeeModalShown = false;
            $state.reload();
            $alert({
                content: 'Attendee successfully added.',
                placement: 'right',
                type: 'success',
                duration: 5
            });
        },function(error){
            $scope.adminAddAttendeeModalShown = false;
            $alert({
                content: 'There was an error. Please try again later.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        })
    }
});