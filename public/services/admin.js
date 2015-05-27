angular.module('Codegurukul')
  .factory('Admin', function($resource) {
    var Admin = {
      default: $resource('/api/admin/courses'),
        attendees: $resource('/api/admin/courses/:cslug/attendees'),
        course: $resource('/api/admin/course')
    };
    return Admin;
  });
