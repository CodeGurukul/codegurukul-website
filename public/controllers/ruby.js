angular.module('Codegurukul')
    .controller('RubyCtrl', function($scope, Email, $alert) {

    $scope.registerModalShown = false;


    $scope.registerModal = function(){
        $scope.registerModalShown = !$scope.registerModalShown;
    };
    
    $scope.sendEmail = function(name, email, contact){
        console.log(email);
        Email.save({
            name: name,
            email: email,
            contact: contact
        },function(data){
            console.log(data);
            $alert({
                content: 'Success.',
                placement: 'right',
                type: 'success',
                duration: 5
            });
        },function(error){
            $alert({
                content: 'There was an error please try again later.',
                placement: 'right',
                type: 'danger',
                duration: 5
            });
        });

       $scope.registerModalShown = !$scope.registerModalShown;
        console.log("here");
    };   

});