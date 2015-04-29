angular.module('Codegurukul')
    .factory('User', function($resource) {
    var User = {
        default: $resource('../data/user.json')
    };
    return User;
});

//angular.module('Codegurukul')
//    .factory('User', function($resource) {
//    return $resource('/api/user/:uslug', null,
//                     {
//        'update': { method:'PUT' }
//    });
//});
//
