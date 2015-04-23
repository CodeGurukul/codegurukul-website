angular.module('Codegurukul')
  .factory('User', function($resource) {
    var User = {
        default: $resource('../data/user.json')
    };
    return User;
  });
