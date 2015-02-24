angular.module('Codegurukul')
  .controller('ProgramCtrl', function($scope, $rootScope, $routeParams, Program) {
  	var slug = $routeParams.pslug;
    $scope.program = Program[slug];
  });