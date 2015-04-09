angular.module('Codegurukul')
  .controller('ContactCtrl', function($scope,$rootScope) {
    
    $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
        $scope.options = {scrollwheel: false};
    console.log('HI');
			
  });