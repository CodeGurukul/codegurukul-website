angular.module('Codegurukul')
    .controller('FooterCtrl', function($scope, $rootScope, $location, Email, $alert) {


    $scope.applyAsMentor = function(name, email, contact, query){
        Email.save({
            name: $scope.name,
            email: $scope.email,
            contact: $scope.contact
        },function(data){
            $alert({
                content: 'Success',
                placement: 'right',
                type: 'success',
                duration: 5
            });
            console.log(email);
        },function(error){
            $alert({
                content: 'There was an error please try again later.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        });
    };

});