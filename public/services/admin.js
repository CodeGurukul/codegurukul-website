angular.module('Codegurukul')
  .factory('Admin', function($resource) {
    var Admin = {
      default: $resource('/api/admin/courses'),
      users: $resource('/api/admin/users'),
        attendees: $resource('/api/admin/courses/:cslug/:sid/attendees'),
        leads: $resource('/api/admin/courses/:cslug/:sid/leads'),
        course: $resource('/api/admin/courses/:cslug'),
        create: $resource('/api/admin/createCourse'),
        addAttendee: $resource('/api/admin/courses/join'),
        changeAttendeeStatus: $resource('/api/admin/courses/:cslug/:sid/attendees/status',{
        cslug: '@cslug', sid: '@sid'
        }, {
            update:   {
                method:'POST', 
                isArray:true
            }
        }),
        changePaymentStatus: $resource('/api/admin/courses/:cslug/:sid/attendees/addPayment')
    };
    return Admin;
  });
