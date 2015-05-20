angular.module('Codegurukul')
  .controller('LandingCtrl', function($scope, $rootScope, Courses, $stateParams) {
    
    Courses.getAll.get({
      cslug: "internship"
    }, function(data) {
      $scope.course = data.course;
      console.log($scope.course);
      });
    
     Courses.getAll.query(function(data) {
      $scope.courses = data;
      console.log($scope.courses);
    })
});