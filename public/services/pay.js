angular.module('Codegurukul')
  .factory('Pay', function($resource) {
    var Pay = {
        default: $resource('/api/payment', {payment_id: '@payment_id'})
    };
    return Pay;
  });