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

    Admin.leads.get({
        cslug:$stateParams.course,
        sid: $stateParams.slot
    },function(data){
        $scope.leads = data.leads;
//        console.log($scope.leads);
    })

    $scope.showAttendees = true;
    $scope.toggleLeadsAttendees = function(){
        $scope.showAttendees = !$scope.showAttendees;
    }

    $scope.sortType = '_id.profile.fullname';
    $scope.sortReverse = false;
    $scope.searchAttendee = '';
    $scope.searchLead = '';

    $scope.adminAddAttendeeModalShown = false;

    $scope.adminAddAttendeeModal = function(){
        $scope.adminAddAttendeeModalShown = !$scope.adminAddAttendeeModalShown;
    }
    $scope.addAttendee = function(){
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
            newUser: $scope.newUser,
            payment_id: $scope.payment_id
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

    $scope.updatePayment = function(mop,paymentStatus,amount,uid,payment_id){
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
                status: paymentStatus,
                uid: uid,
                payment_id: payment_id
            },function(data){
                $alert({
                    content: 'Update successful.',
                    placement: 'right',
                    type: 'success',
                    duration: 5
                });
                $scope.edited = false;
            },function(error){
                $alert({
                    content: 'There was an error. Please try again later.',
                    placement: 'right',
                    type: 'danger',
                    duration: 5
                });
                $scope.edited = false;
            })
        }
    }

    $scope.tableSelection = {};

    $scope.uidList = [];

    Array.prototype.remove = function(value) {
        this.splice(this.indexOf(value), 1);
        return true;
    };

    $scope.listArray = function(attendeeId, index){
        if($scope.tableSelection[index] == true){
            $scope.uidList.push(attendeeId);
        }
        else{
            $scope.uidList.remove(attendeeId);
        }
    }

    $scope.statusChange = function(){

        if($scope.uidList.length == '0'){
            $alert({
                content: 'No attendee selected',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        }
        else{
            Admin.changeAttendeeStatus.update({
                cslug : $stateParams.course,
                sid : $stateParams.slot
            },{
                users: $scope.uidList,
                progressStatus: $scope.progressStatus
            },function(data){
                $alert({
                    content: 'Update completed successfully',
                    placement: 'right',
                    type: 'success',
                    duration: 5
                });
                $state.reload();
            },function(err){
                $alert({
                    content: 'There was an error. Please try again later',
                    placement: 'right',
                    type: 'danger',
                    duration: 5
                });
            })
        }
    }


});