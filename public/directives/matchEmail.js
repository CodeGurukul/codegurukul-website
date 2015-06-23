angular.module('Codegurukul')
  .directive('matchEmail', function($http) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.bind('blur', function() {
          if (ngModel.$modelValue) {
            $http.get('/api/users', { params: { email: ngModel.$modelValue } }).success(function(data) {
                console.log(data.available+ " match");
              ngModel.$setValidity('match', !data.available);
            });
          }
        });
        element.bind('keyup', function() {
          ngModel.$setValidity('match', true);
        });
      }
    };
  });