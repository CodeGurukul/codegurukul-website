angular.module('Codegurukul')
  .controller('NavbarCtrl', function($scope,$rootScope, Auth,$location) {
    $scope.logout = function() {
      Auth.logout();
    }
    
    $rootScope.signupWithEmailModal = function(){
        $rootScope.signupWithEmailModalShown = !$rootScope.signupWithEmailModalShown;
        $rootScope.modalName = "signupWithEmailModal()";
    }

    $rootScope.loginModal = function(){
        $rootScope.loginModalShown = !$rootScope.loginModalShown;
        $rootScope.modalName = "loginModal()";
    }  
  });
