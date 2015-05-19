angular.module('Codegurukul')
    .factory('Codes', function($resource) {
    var Codes = {
        default: $resource('/api/codes/:cslug/validateCode',{
        cslug: '@cslug'
        })
    }
    return Codes;
});
