angular.module('Codegurukul')
    .controller('AngularjsCtrl', function($scope, $alert, $rootScope) {
   
    $scope.registerModalShown = false;
    $rootScope.coursePrice = '';
    $rootScope.courseName = '';


    $scope.registerModal = function(){
        $scope.registerModalShown = !$scope.registerModalShown;
        $rootScope.coursePrice = '350000';
        $rootScope.courseName = 'AngularJS Workshop';
    };
    
 
});