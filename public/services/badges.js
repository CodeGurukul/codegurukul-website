angular.module('Codegurukul')
    .factory('Badges', function($resource) {
    var Badges = {
        default: $resource('/api/badges',{},
                           {'query': {method:'GET', isArray:true}
                           }
                          )
    }
    return Badges;
});

//{
//    return $resource('/api/badges');
//  });