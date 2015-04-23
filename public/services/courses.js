angular.module('Codegurukul')
  .factory('Courses', function($resource) {
    var Courses = {
        default: $resource('../data/courses.json'),
        domains: $resource('../data/domains.json')
    };
    return Courses;
  });
