angular.module('Codegurukul')
  .factory('Courses', function($resource) {
    var Courses = {
      default: $resource('../data/courses.json'),
      canJoin: $resource('/api/courses/:cslug/canjoin'),
      getAll: $resource('/api/courses/:cslug', {
	      cslug: '@cslug'
				}, {
				update: {
				  method: 'PUT'
				}
			}),
      join: $resource('/api/courses/:cslug/join', {
        cslug: '@cslug'
        }, {
        update: {
          method: 'PUT'
        }
      }),
      domains: $resource('../data/domains.json')
    };
    return Courses;
  });
