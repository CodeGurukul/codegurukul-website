angular.module('Codegurukul')
    .controller('AdminCtrl', function($scope, $alert, $rootScope, Courses) {

Courses.default.get(function(data) {
      $scope.courses = data;
      console.log($scope.courses.length);
    })


});