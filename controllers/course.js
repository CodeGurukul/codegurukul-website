var Course = require('../models/Course');
var User = require('../models/User');
var fs = require('fs');
var moment = require('moment');
var secret = require('../config/secrets');
var config = new secret();

exports.getCourses = function(req, res) {
	console.log('HEREEEEEEEEEE');
  var query = Course.find().select('name slug description domain price content thumb');
  query.exec(function(err, courses) {
    if (err) return err;
    res.send(courses);
  });
};

exports.getCourse = function(req, res) {
  Course.findOne({slug: req.params.cslug})
  .populate({
    path:'attendees._id'
  })
  .exec(function(err, course) {
    if (err)
      res.send(err);
    else if(!course){
      res.status(404).send('Course Not Found');
    }
    else{
      var temp = {};
      temp.course = course;
      if (req.user)
        if(course.attendees.id(req.user._id)) temp.joined = true;
			console.log(temp);
      res.send(temp);
    }
  });
};

exports.joinCourse = function(req, res) {
  Course.findOne({slug:req.params.cslug},function(err, course) {
    if (err) res.send(err);
    else if (!course) res.send(404).send('Course not found.');
    else {
      User.findOne(req.user._id, function (err, user) {
        if (err) res.send(err);
        else if (!user) res.status(404).send('User not found.');
        else if(user.courses.id(course._id)) res.status(412).send('Course Already Joined');
        else{
          console.log('ready to save');
          user.courses.push({_id:course._id});
          console.log(course._id);
          console.log(user);
          course.attendees.push({_id:user._id});
          course.save(function (err) {
            if(err) res.send(err);
            else{
              user.save(function (err) {
                if (err) res.send(err);
                else{
                  res.json({message:'Course joined.'})
                }
              })
            }
          })
        }
      })
    }
  })
}