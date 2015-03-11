angular.module('Codegurukul')
  .factory('Program', function($resource) {
    var list = {
      fresherTohacker :  {
          tempateUrl: "../views/program-partials/fresher-to-hacker.html",
          published: true,
          other: 'asdasd'
        },
        freelancerForLife : {
          tempateUrl: "../views/program-partials/freelancer-for-life.html",
          published: true,
          other: 'asdasd'
        },
        career : {
          tempateUrl: "../views/program-partials/career.html",
          published: true,
          other: 'asdasd'
        },
        earlyHacker : {
          tempateUrl: "../views/program-partials/early-hacker.html",
          published: true,
          other: 'asdasd'
        }
    }
    return list;
  });