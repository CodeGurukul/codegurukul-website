angular.module('Codegurukul')
    .controller('InternshipsCtrl', function($scope, $rootScope) {

    $scope.registerModalShown = false;
    $scope.signupModalShown = false;
    $scope.signupWithEmailModalShown = false;
    $scope.loginModalShown = false;
    $rootScope.coursePrice = '800000';
    $rootScope.courseName = 'Internship';

    $scope.payment = function(){
        if($rootScope.currentUser){
            $scope.registerModal();
        }
        else{
            $scope.signupModal();
        }
    }

    $scope.signupModal = function(){
        $scope.signupModalShown = !$scope.signupModalShown;
    } 

    $scope.loginModal = function(){
        $scope.loginModalShown = !$scope.loginModalShown;
    }  

    $scope.signupWithEmailModal = function(){
        $scope.signupWithEmailModalShown = !$scope.signupWithEmailModalShown;
    }

    $scope.registerModal = function(){
        $scope.registerModalShown = !$scope.registerModalShown;

    };

    console.log($rootScope.currentUser);

});
