angular.module('Codegurukul')
  .controller('NavbarCtrl', function($scope,$rootScope, Auth,$location) {
    $scope.logout = function() {
      Auth.logout();
    }
    
    $scope.signupWithEmailModal = function(){
        $scope.signupWithEmailModalShown = !$scope.signupWithEmailModalShown;
    }

    $scope.loginModal = function(){
        $scope.loginModalShown = !$scope.loginModalShown;
    }  
  });
