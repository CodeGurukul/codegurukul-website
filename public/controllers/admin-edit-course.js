angular.module('Codegurukul')
    .controller('AdminEditCourseCtrl', function($scope, $alert, $rootScope, Admin, $stateParams) {

    
    Admin.course.get({
        cslug: $stateParams.course

    }, function(data) {
        $scope.course = data;
//        console.log(data);
        console.log($scope.course);
        
        if($scope.course.date){
            var stringDate = $scope.course.date;
            $scope.course.date = new Date(stringDate);
            console.log($scope.course.date);
        }
    });

});