angular.module('Codegurukul')
  .controller('LoginCtrl', function($scope, $rootScope, Auth, $location) {
    $scope.login = function() {
      Auth.login({ email: $scope.email, password: $scope.password });
    };
//    $scope.githubLogin = function() {
//      Auth.githubLogin();
//    };
//    $scope.linkedinLogin = function() {
//      Auth.linkedinLogin();
//    };
    $scope.pageClass = 'fadeZoom';
  
  });