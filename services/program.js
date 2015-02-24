angular.module('Codegurukul')
  .factory('Program', function($resource) {
    var list = {
      f2h :  {
          tempateUrl: "../views/program-partials/fresher-to-hacker.html",
          published: true,
          other: 'asdasd'
        },
        ffl : {
          tempateUrl: "../views/program-partials/freelancer-for-life.html",
          published: true,
          other: 'asdasd'
        },
        ent : {
          tempateUrl: "../views/program-partials/entrepreneurship.html",
          published: true,
          other: 'asdasd'
        },
        eha : {
          tempateUrl: "../views/program-partials/early-hacker.html",
          published: true,
          other: 'asdasd'
        }
    }
    return list;
  });