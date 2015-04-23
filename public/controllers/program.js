angular.module('Codegurukul')
    .controller('ProgramCtrl', function($scope, $rootScope, $stateParams, Program, Courses) {

    $scope.notifyButton = '';
    $scope.registerButton = '';

    Courses.getAll.get({
        cslug: $stateParams.course

    }, function(data){
        $scope.course = data;
        if($scope.course.date === "COMING SOON"){
            $scope.notifyButton = true;
            $scope.registerButton = false;
        }
        else{
            $scope.registerButton = true;
            $scope.notifyButton = false;
        }
    });

    $scope.loginModalShown = false;

});