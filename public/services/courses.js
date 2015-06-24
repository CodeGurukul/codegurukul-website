angular.module('Codegurukul')
  .factory('Courses', function($resource) {
    var Courses = {
      default: $resource('../data/courses.json'),
      canJoin: $resource('/api/courses/:cslug/canjoin'),
      getCourse: $resource('/api/courses/:cslug', {
	      cslug: '@cslug'
				}, {
				update: {
				  method: 'PUT'
				}
			}),
//      join: $resource('/api/courses/:cslug/join', {
      join: $resource('/api/courses/join', {
        cslug: '@cslug'
        }, {
        update: {
          method: 'PUT'
        }
      }),
        addLead: $resource('/api/courses/:cslug/addlead', {
        cslug: '@cslug'
        }, {
        update: {
          method: 'PUT'
        }
      }),
      domains: $resource('../data/domains.json'),
    };
    return Courses;
  });
