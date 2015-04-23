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
	console.log(req.params.cslug);
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
			console.log(course);
      res.send(course);
    }
  });
};