angular.module('Codegurukul')
  .factory('Email', function($resource, $window) {
    return $resource('http://uhack.it/api/contact');
  });