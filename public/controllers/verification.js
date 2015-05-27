angular.module('Codegurukul')
    .controller('VerificationCtrl', function($scope, $alert, $rootScope, User, $stateParams, $state, $timeout) {

    $scope.pending = true;
    $scope.processing = true;

    User.verify.save({
        verificationCode: $stateParams.verificationCode
    },function(data){
        //        $state.go('home');
        $timeout(function() {
            $state.go('home');
        }, 5000);
        $alert({
            content: 'Your email has successfully been verified.',
            placement: 'right',
            type: 'success',
            duration: 5
        });
    }, function(error){
        $scope.pending = false;
        $alert({
            content: 'There was an error. Please try again later.',
            placement: 'right',
            type: 'danger',
            duration: 5
        });
    });
});

