var Course = require('../models/Course');
var User = require('../models/User');
var email = require('../controllers/email');
var courseCont = require('../controllers/course');
var fs = require('fs');
var moment = require('moment');
var secret = require('../config/secrets');
var config = new secret();
var badge = require('../controllers/badge');

exports.getCourses = function(req, res) {
  var query = Course.find().select('name slug description domain price content thumb date');
  query.exec(function(err, courses) {
    if (err) return err;
    res.send(courses);
  });
};

exports.courseComplete = function(req,res)
{
  var courseId =  req.body.cid;
  var userId = req.body.cid;
  badge.assignBadge(cid,uid);
}

exports.canJoin = function(req, res) {
  console.log('canJoin');
  Course.findOne({
    slug: req.params.cslug
  }, function(err, course) {
    if (err) res.send(err);
    else if (!course) res.send(404).send('Course not found.');
    else {
      User.findById(req.user._id, function(err, user) {
        if (err) res.send(err);
        else if (!user) res.status(404).send('User not found.');
          else if (user.courses.id(course._id)) res.status(412).send('Course Already Joined');
        else {
          res.sendStatus(200);
          courseCont.addLead(user.id, course.slug);
        }
      })
    }
  })
}

exports.getCourse = function(req, res) {
  console.log('get course');
  Course.findOne({
      slug: req.params.cslug
    })
    .exec(function(err, course) {
      if (err)
        res.send(err);
      else if (!course) {
        res.status(404).send('Course Not Found');
      } else {
        console.log('course found');
        console.log(course);
        var temp = {};
        temp.course = course;
          temp.joined = false;
        if (req.user)            
           if (course.attendees.id(req.user._id)) temp.joined = true;
        res.send(temp);
      }
    });
};

exports.joinCourse = function(req, res, next) {
  var cslug;
  if (req.params.cslug) cslug = req.params.cslug;
  if (req.body.cslug) cslug = req.body.cslug;
  console.log(cslug);
  Course.findOne({
    slug: cslug
  }, function(err, course) {
    if (err) res.status(400).send(err);
    else if (!course) res.send(404).send('Course not found.');
    else {
      User.findById(req.user._id, function(err, user) {
        if (err) res.send(err);
        else if (!user) res.status(404).send('User not found.');
        else if (user.courses.id(course._id)) res.status(412).send('Course Already Joined');
        else {
          user.courses.push({
            _id: course._id
          });
          course.attendees.push({
            _id: user._id
          });
          if (course.leads.id(user.id)) {
            course.leads.pull({_id: user._id});
          };
          course.save(function(err) {
            if (err) res.status(400).send(err);
            else {
              user.save(function(err) {
                if (err) res.status(400).send(err);
                else {
                  req.to = user.email;
                  req.name = user.profile.fullname;
                  req.userId = user._id;
                  req.courseId = course._id;
                  req.course = course.name;
                  req.courseDate = course.date;
                  req.courseSlug = course.slug;
                  var emailData = {
                    to: user.email,
                    course: course.name,
                    courseDate: course.date,
                    courseSlug: course.slug,
                    userName: user.username
                  };
                  email.sendCourseReg(emailData);
                  if (req.pay) next();
                  else res.json({ message: 'Registration successfull'});
                  badge.assign(course._id, user._id);
                }
              })
            }
          })
        }
      })
    }
  })
}

exports.addLead = function (uid, cslug) {
  Course.findOne({slug: cslug}, function (err, course) {
    if (err) return;
    else if (!course) return;
    else {
      if (course.leads.id(uid)) return;
      course.leads.push(uid);
      course.save(function  (err, course) {
        if (err) return;
        else {
          console.log("lead added");
          return;}
      })
    }
  })
}

exports.leadPre = function (req, res) {
  if (req.params.cslug && req.user._id) {
    courseCont.addLead(req.user._id, req.params.cslug);
    res.status(200).send("Success");
  };
}