angular.module('Codegurukul')
    .controller('ProgramCtrl', function($scope, $rootScope, $stateParams, Program, Course) {
    //  	var slug = $routeParams.pslug;
    //    $scope.program = Program[slug];

    $scope.notifyButton = '';
    $scope.registerButton = '';

    Course.default.get({
        course: $stateParams.course

    }, function(data){
        $scope.course = data;
        $scope.descriptionHtml = data.description;
        $scope.courseStatus = data.courseDate;
        $scope.coursePrice = data.price;
        $rootScope.coursePrice = $scope.coursePrice+'00';
        $rootScope.courseName = data.name;

        if($scope.courseStatus === "COMING SOON"){
            $scope.notifyButton = true;
            $scope.registerButton = false;
        }
        else{
            $scope.registerButton = true;
            $scope.notifyButton = false;
        }
        console.log($scope.courseStatus);
        console.log($scope.coursePrice);
    });

    $scope.loginModalShown = false;
    $scope.sendResumeModalShown = false;
    $scope.info = function(){
        console.log('here');
        $scope.sendResumeModalShown = !$scope.sendResumeModalShown;

    };
});