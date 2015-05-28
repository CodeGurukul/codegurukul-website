angular.module('Codegurukul')
    .controller('AdminCtrl', function($scope, $alert, $rootScope, Admin) {

    Admin.default.query(function(data) {
        $scope.courses = data;
        console.log($scope.courses);
    })

    $scope.createCourseModalShown = false;

    $scope.createCourseModal = function(){
        $scope.createCourseModalShown = !$scope.createCourseModalShown;
    }
    
    
//    $scope.courseName = "";
    $scope.createCourse = function(){
        console.log("here "+ $scope.courseName);
        Admin.create.save({
            name: $scope.name
        },function(data){
            console.log("Success");
        },function(error){
            console.log("error");
        });
    };

});