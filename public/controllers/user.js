angular.module('Codegurukul')
  .controller('UserCtrl', function($scope, User) {
  	$scope.all = false;
  	User.default.get(function(data){
			$scope.user = data;
		});

		$scope.allBadges = function () {
			Badges.default.get(function(data){
				$scope.user.temp = data;
			});
		}

		$scope.filterLocked = function (badge) {
			if ($scope.all) return true;
			return !badge.locked;
		}
  });