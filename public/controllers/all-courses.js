angular.module('Codegurukul')
  .controller('AllCoursesCtrl', function($scope, Courses) {
    $scope.all = true;
    Courses.domains.query(function(data) {
      $scope.domains = data;
    });
    // Courses.default.query(function(data) {
    //   $scope.courses = data;
    // });
    Courses.getAll.query(function(data) {
      $scope.courses = data;
      console.log($scope.courses);
    })
    $scope.courseFilter = function(a) {
      // console.log(a);
      if ($scope.all) return true;
      if ($scope.price) {
        if ($scope.price.pay && a.price) {
          return true
        };

        if ($scope.price.free && !a.price) {
          return true
        };
      };
      for (tech in $scope.domains) {
        // console.log($scope.domains[tech]);
        var t = $scope.domains[tech];
        if (t.on && a.domain.toLowerCase().indexOf(t.name.toLowerCase()) > -1) {
          console.log('match');
          return true;
        }
      }
    }

    $scope.filterClick = function() {
      if ($scope.all) $scope.all = false;
      if ($scope.price) {
        if ($scope.price.pay) return;
        if ($scope.price.free) return;
      };
      for (tech in $scope.domains) {
        var t = $scope.domains[tech];
        if (t.on) return;
      }
      $scope.all = true;
    }

    $scope.filterAll = function() {
      if ($scope.all) {
        if ($scope.price) $scope.price.pay = $scope.price.free = false;
        for (tech in $scope.domains) $scope.domains[tech].on = false;
      };
    }

  });