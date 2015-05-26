angular.module('Codegurukul')
    .controller('SignupCtrl', function($scope, Auth, $location,  $alert, $rootScope){
    $scope.signup = function() {
        $rootScope.emailForVerification = $scope.email;
        Auth.signup({
            fullname: $scope.fullname,
            username: $scope.username,
            email: $scope.email,
            password: $scope.password,
            type: $scope.type,
            college: $scope.college,
            stream: $scope.stream,
            year: $scope.year,
            organization: $scope.organization,
            workDesc: $scope.workDesc,
            mobile: $scope.mobile
        });
    };
    //    $scope.pageClass = 'fadeZoom';

   

});