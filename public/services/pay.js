angular.module('Codegurukul')
  .factory('Pay', function($resource) {
    var Pay = {
        default: $resource('/api/payment')
    };
    return Pay;
  });