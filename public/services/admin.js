angular.module('Codegurukul')
  .factory('Admin', function($resource) {
    var Admin = {
      default: $resource('/api/admin/courses'),
        attendees: $resource('/api/admin/courses/:cslug/:sid/attendees'),
        leads: $resource('/api/admin/courses/:cslug/:sid/leads'),
        course: $resource('/api/admin/courses/:cslug'),
        create: $resource('/api/admin/createCourse'),
        addAttendee: $resource('/api/admin/courses/join')
    };
    return Admin;
  });
