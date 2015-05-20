var Course = require('../models/Course');
var secret = require('../config/secrets');
var config = new secret();
var mongoose = require('mongoose');


exports.getCourses = function(req, res) {
  var query = Course.find().select('name slug description price date status');
  query.exec(function(err, courses) {
    if (err) return err;
    res.send(courses);
  });
};

exports.getCourse = function(req, res) {
  Course.findOne({
    slug: req.params.cslug
  })
  .select('-attendees')
  .exec(function(err, course) {
    if (err)
      res.send(err);
    else if (!course) {
      res.status(404).send('Course Not Found');
    } else {
      res.send(course);
    }
  });
};

exports.getAttendees = function(req, res) {
  Course.findOne({
    slug: req.params.cslug
  })
  .select('name slug attendees')
  .exec(function(err, course) {
    if (err)
      res.send(err);
    else if (!course) {
      res.status(404).send('Course Not Found');
    } else {
      res.send(course);
    }
  });
};














