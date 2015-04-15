angular.module('Codegurukul')
    .controller('StartupCtrl', function($scope, Email, $alert, $rootScope) {

   
    $scope.registerModalShown = false;
    $rootScope.coursePrice = '';
    $rootScope.courseName = '';


    $scope.registerModal = function(){
        $scope.registerModalShown = !$scope.registerModalShown;
        $rootScope.coursePrice = '350000';
        $rootScope.courseName = 'Startup Team Training Workshop';
    };
    
 
});