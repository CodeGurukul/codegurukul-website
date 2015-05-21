angular.module('Codegurukul')
    .controller('AdminCtrl', function($scope, $alert, $rootScope, Admin) {

    Admin.default.query(function(data) {
        $scope.courses = data;
        console.log($scope.courses);
    })


});