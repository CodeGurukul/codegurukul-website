angular.module('Codegurukul')
  .factory('Email', function($resource, $window) {
    return $resource('/api/email');
  });