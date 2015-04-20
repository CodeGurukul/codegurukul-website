angular.module('Codegurukul')
    .controller('AngularjsCtrl', function($scope, $alert, $rootScope,$stateParams) {

    $scope.registerModalShown = false;
    $scope.signupModalShown = false;
    $scope.signupWithEmailModalShown = false;
    $scope.loginModalShown = false;
    $rootScope.coursePrice = '';
    $rootScope.courseName = '';

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
        $rootScope.coursePrice = '350000';
        $rootScope.courseName = 'AngularJS Workshop';
    };
    
    console.log($stateParams.course);

});