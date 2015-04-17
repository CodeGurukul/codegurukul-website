angular.module('Codegurukul')
  .controller('SignupCtrl', function($scope, Auth, $location){
    $scope.signup = function() {
      Auth.signup({
        username: $scope.username,
        email: $scope.email,
        password: $scope.password
      });
    };
//    $scope.pageClass = 'fadeZoom';
  
  });