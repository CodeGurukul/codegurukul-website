var Course = require('../models/Course');
var User = require('../models/User');
var Badge = require('../models/Badge');
var secret = require('../config/secrets');
var config = new secret();
var mongoose = require('mongoose');

var assignBadge = function(cid, uid) {
  console.log('Assign badge');
  console.log(cid + " " + uid);
  Badge.find({'courses._id':mongoose.Types.ObjectId(cid)}, function(err, badges) {
  	if (err) console.log(err);
  	else if (!badges.length) console.log("no badge for this course");
  	else {
  		User.findById(uid, function(err, user) {
        if (err) console.log(err);
        else if (!user) console.log('User not found');
  			else { 
  				for (var i = 0; i < badges.length; i++) {
		        if (user.badges.id(badges[i]._id)) console.log('Badge Already assigned');
		        else {
		          console.log(user.id);
		          user.badges.push({
		            _id: badges[i]._id
		          });
		         }
					};
          user.save(function(err) {
            if (err) res.send(err);
            else {
              console.log('badges assigned');
              res.send(200);
            }
          });
				}
      });
  	}
  });
  return;
};

exports.getBadges = function (req, res) {
	Badge.find().lean().exec(function (err, badges) {
		if (err) res.send(err);
		if (!badges.length) res.send('Error - badges not found');
		else {
			User.findById(req.user._id, function (err, user) {
				if (err) res.send(err);
        else if (!user) res.status(404).send('User not found.');
        else {
        	for (var i = 0; i <badges.length; i++) {
        		if (user.badges.id(badges[i]._id)) {
        			badges[i].locked = false;
        		} else badges[i].locked = true;
        	};
        	res.send(badges);
        }
			})
		}
	})
};

exports.assign = assignBadge;
















