angular.module('Codegurukul')
  .factory('Course', function($resource) {
    var Course = {
        default: $resource('../data/:course.json', {course: '@course'})
    };
    return Course;
  });