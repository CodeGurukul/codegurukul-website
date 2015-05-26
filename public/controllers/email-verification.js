angular.module('Codegurukul')
    .controller('VerifyEmailCtrl', function($scope, $alert, $rootScope, User, $stateParams, $state, $timeout) {

    $scope.resendEmail = function(){
        console.log($rootScope.emailForVerification + "Email");
        User.resendEmail.save({
            email: $rootScope.emailForVerification
        },function(data){
            $alert({
                content: 'Mail has successfully been resent.',
                placement: 'right',
                type: 'success',
                duration: 5
            });
        }, function(error) {
            $alert({
                content: 'There was an error please try again later.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        });
    };


});