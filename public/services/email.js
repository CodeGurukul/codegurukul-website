angular.module('Codegurukul')
  .factory('Email', function($resource, $window) {
  	    var Email = {
        default: $resource('/api/email'),
        newsletter: $resource('/api/newsletter')
    };
    return Email;
  });