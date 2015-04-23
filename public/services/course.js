angular.module('Codegurukul')
  .factory('Course', function($resource) {
    var Course = {
        default: $resource('/api/courses/:cslug')
    };
    return Course;
  });