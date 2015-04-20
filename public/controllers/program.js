angular.module('Codegurukul')
    .controller('ProgramCtrl', function($scope, $rootScope, $stateParams, Program, Course) {
    //  	var slug = $routeParams.pslug;
    //    $scope.program = Program[slug];
    
    Course.default.get({
        course: $stateParams.course

    }, function(data){
        $scope.course = data;
    });
});