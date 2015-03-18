angular.module('Codegurukul')
    .controller('AngularjsCtrl', function($scope, $rootScope, $routeParams, Program) {

    $scope.socialShareModalShown = false;
    $scope.registerModalShown = false;

    $scope.shareModal = function(){
        $scope.socialShareModalShown = true;
    };

    $scope.registerModal = function(){
        $scope.registerModalShown = !$scope.registerModalShown;
    };

});