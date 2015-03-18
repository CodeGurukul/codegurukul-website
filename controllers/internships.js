angular.module('Codegurukul')
    .controller('InternshipsCtrl', function($scope, $rootScope, $routeParams, Program) {

    $scope.socialShareModalShown = false;
    $scope.registerModalShown = false;

    $scope.shareModal = function(){
        $scope.socialShareModalShown = true;
    };

    $scope.registerModal = function(){
        $scope.registerModalShown = !$scope.registerModalShown;
    };

});