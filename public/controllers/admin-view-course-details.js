angular.module('Codegurukul')
    .controller('AdminCourseDetailsCtrl', function($scope, $alert, $rootScope, Admin, $stateParams, $state) {

    $scope.newUser = true;

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
        console.log($scope.fullname+""+$scope.username+""+$scope.email+""+$scope.mop+""+$scope.mobile+""+$scope.paymentStatus+""+$scope.newUser+""+$scope.amount);
        Admin.addAttendee.save({
            cslug: $stateParams.course,
            sid: $stateParams.slot,
            fullname: $scope.fullname,
            username: $scope.username,
            email: $scope.email,
            mobile: $scope.mobile,
            mop: $scope.mop,
            amount: $scope.amount,
            paymentStatus: $scope.paymentStatus,
            newUser: $scope.newUser
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
                content: error.data,
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        })
    }
    $scope.edit = false;

    $scope.edited = false;
    $scope.change = function(){
        $scope.edited = true;
    }

    $scope.updatePayment = function(mop,status,amount,uid){
        console.log($scope.edited);
        if($scope.edited == false){
            $alert({
                content: 'No changes were made.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        }
        else if ($scope.edited == true){
            Admin.changePaymentStatus.save({
                cslug: $stateParams.course,
                sid: $stateParams.slot
            },{
                mop: mop,
                amount: amount,
                status: status,
                uid: uid
            },function(data){
                $alert({
                    content: 'Update successful.',
                    placement: 'right',
                    type: 'success',
                    duration: 5
                });
            },function(error){
                $alert({
                    content: 'There was an error. Please try again later.',
                    placement: 'right',
                    type: 'danger',
                    duration: 5
                });
            })
        }
    }
});