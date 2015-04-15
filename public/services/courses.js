angular.module('Codegurukul')
  .factory('Courses', function($resource) {
    return $resource('/api/courses');
  });
