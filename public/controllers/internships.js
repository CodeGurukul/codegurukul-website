angular.module('Codegurukul')
    .controller('InternshipsCtrl', function($scope, $rootScope) {


    $scope.registerModalShown = false;
    $rootScope.coursePrice = '';
    $rootScope.courseName = '';


    $scope.registerModal = function(){
        $scope.registerModalShown = !$scope.registerModalShown;
        $rootScope.coursePrice = '800000';
        $rootScope.courseName = 'Internship';
    };


});