angular.module('Codegurukul')
    .controller('ProgramCtrl', function($scope, $rootScope, $stateParams, Program, Courses) {

    $scope.notifyButton = '';
    $scope.registerButton = '';

    Courses.getAll.get({
        cslug: $stateParams.course

    }, function(data){
        $scope.course = data;
        console.log($scope.course.courseContent);
        
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
    $scope.registerModalShown = false;
    $scope.registerModal = function(){
        $scope.registerModalShown = !$scope.registerModalShown;

    };
});