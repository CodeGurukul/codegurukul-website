angular.module('Codegurukul')
  .factory('User', function($resource) {
    var User = {
        default: $resource('../data/user.json')
    };
    return User;
  });

//    .factory('User', function($resource, $window) {
//    return $resource('/api/user/:uslug', null,
//                     {
//        'update': { method:'PUT' }
//    });
//});
//
