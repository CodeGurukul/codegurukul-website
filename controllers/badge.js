var Course = require('../models/Course');
var User = require('../models/User');
var secret = require('../config/secrets');
var config = new secret();

var assignBadge = function(cid, uid) {
  console.log('Assign badge');
  console.log(cid + " " + uid);
  return;
};

exports.assign = assignBadge;
