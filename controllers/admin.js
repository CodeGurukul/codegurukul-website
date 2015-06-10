var Course = require('../models/Course');
var User = require('../models/User');
var secret = require('../config/secrets');
var config = new secret();
var mongoose = require('mongoose');

exports.getUsers = function (req, res) {
  User.find().select('-password').exec(function (err, users) {
    if (err) return res.status(400).send(err);
    else if (!users) res.status(400).send("No users");
    else {
      res.send(users);
    }
  })
}

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
  .select('-attendees -leads')
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
  .select('name slug slots')
  .populate({
    path: 'slots.attendees._id',
    select: 'slug email username mobile profile.fullname'
  })
  .exec(function(err, course) {
    if (err) res.send(err);
    else if (!course) res.status(404).send('Course Not Found');
    else if (!course.slots.id(req.params.sid)) res.status(400).send("Invalid slot ID");
    else {
      var temp = {
        name: course.name,
        slug: course.slug,
        slotId: req.params.sid,
        attendees: course.slots.id(req.params.sid).attendees 
      }
      res.send(temp);
    }
  });
};

exports.changeAttendeeStatus = function (req, res) {
  if (req.params.cslug && req.params.sid) {
    if (req.body.status == "completed" ||
        req.body.status == "registered" ||
        req.body.status == "cancelled") {
      Course.findOne({slug: req.params.cslug}, function (err, course) {
        if (err) res.send(err);
        else if (!course) res.status(404).send('Course Not Found');
        else if (!course.slots.id(req.params.sid)) res.status(400).send("Invalid slot ID");
        else {
          var result = [];
          for (var i = 0; i < req.body.users.length; i++) {
            if(course.slots.id(req.params.sid).attendees.id(req.body.users[i])) {
              course.slots.id(req.params.sid).attendees.id(req.body.users[i]).status = req.body.status; 
              if (req.body.status == "completed") 
                course.slots.id(req.params.sid).attendees.id(req.body.users[i]).completionDate = Date.now();
              result.push({
                id: req.body.users[i],
                status: req.body.status
              })
            } else {
              result.push({
                id: req.body.users[i],
                status: "Invalid user ID"
              })
            }
          };
          course.save(function (err, course) {
            if (err) res.status(400).send(err);
            else {
              res.send(result);
            }
          })
        }
      })
    } else  res.status(400).send("Status invalid")
  } else res.status(400).send("Course slug and slot ID needed")
}

exports.getLeads = function(req, res) {
  Course.findOne({
    slug: req.params.cslug
  })
  .select('name slug slots')
  .populate({
    path: 'slots.leads._id',
    select: 'slug email username mobile profile.fullname'
  })
  .exec(function(err, course) {
    if (err)
      res.send(err);
    else if (!course) res.status(404).send('Course Not Found'); 
    else if (!course.slots.id(req.params.sid)) res.status(400).send("Invalid slot ID");
    else {
      var temp = {
        name: course.name,
        slug: course.slug,
        slotId: req.params.sid,
        leads: course.slots.id(req.params.sid).leads 
      }
      res.send(temp);
    }
  });
};

exports.createCourse = function (req, res) {
  if (req.body.name) {
    var slug = slugify(req.body.name);
    Course.count({slug: slug}, function (err, count) {
      if (err) return res.status(400).send(err);
      if (count == 0) {
        var course = new Course({
          name: req.body.name
        });
        course.save(function (err, course) {
          if (err) return res.status(400).send(err);
          else {
            return res.json(course);
          }
        });   
      }else {
        return res.status(411).send("That course name is already used")
      }
    })
  };
};

exports.updateCourse = function (req, res) {
  Course.findOne({
    cslug: req.body.cslug
  }, function (err, course) {
    if (err) return res.status(400).send(err);
    if (!course) return res.status(404).send("Course not found");
    else {
      course.description = req.body.description;
      course.shortDescription = req.body.shortDescription;
      if (!isNumber(req.body.price)) return res.status(400).send("Price should be a number");
      course.price = req.body.price;
      course.tech = req.body.tech;
      course.duration = req.body.duration;
      course.date = req.body.date;
      if (!isNumber(req.body.batchSize)) return res.status(400).send("Batch size should a number");
      course.batchSize = req.body.batchSize;
      course.inviteOnly = req.body.inviteOnly;
      if (course.inviteOnly) course.inviteMessage = req.body.inviteMessage;
      for (var i = 0; i <= req.body.mentors.length - 1; i++) {
        if (req.body.mentors[i]._id) {
          if(course.mentors.id(req.body.mentors[i]._id)){
            course.mentors.id(req.body.mentors[i]._id).title = req.body.mentors[i].title;
            course.mentors.id(req.body.mentors[i]._id).description = req.body.mentors[i].description;
          }
          else{
            res.status(412).send('Invalid testimonial Id');
          }
        } else {
          course.mentors.push({
            title: req.body.mentors[i].title,
            description: req.body.mentors[i].description
          });
        }
      };
      for (var i = 0; i <= req.body.content.length - 1; i++) {
        if (req.body.content[i]._id) {
          if(course.content.id(req.body.content[i]._id)){
            course.content.id(req.body.content[i]._id).title = req.body.content[i].title;
            course.content.id(req.body.content[i]._id).duration = req.body.content[i].duration;
            course.content.id(req.body.content[i]._id).difficulty = req.body.content[i].difficulty;
            course.content.id(req.body.content[i]._id).description = req.body.content[i].description;
          }
          else{
            res.status(412).send('Invalid content Id');
          }
        } else {
          course.content.push({
            title: req.body.content[i].title,
            duration: req.body.content[i].duration,
            difficulty: req.body.content[i].difficulty,
            description: req.body.content[i].description,
          });
        }
      };
      for (var i = 0; i <= req.body.testimonials.length - 1; i++) {
        if (req.body.testimonials[i]._id) {
          if(course.testimonials.id(req.body.testimonials[i]._id)){
            course.testimonials.id(req.body.testimonials[i]._id).title = req.body.testimonials[i].title;
            course.testimonials.id(req.body.testimonials[i]._id).description = req.body.testimonials[i].description;
          }
          else{
            res.status(412).send('Invalid testimonial Id');
          }
        } else {
          course.testimonials.push({
            title: req.body.testimonials[i].title,
            description: req.body.testimonials[i].description
          });
        }
      };

      course.save(function (err, course) {
        if (err) return res.status(400).send(err);
        else {
          res.status(200).send("Course updated successfully");
        }
      })
    }
  })
}


exports.joinPrep = function (req, res, next) {
  if (req.body.fullname && req.body.username && req.body.email 
    && req.body.mobile && req.body.mop && req.body.amount 
    && req.body.cslug && req.body.sid) {
    req.body.password = codeGen(5);
    req.admin = true;
    req.pay = true;
    req.mop = req.body.mop;
    req.coursePrice = req.body.amount;
    next();
  } else return res.status(400).send("Enter all required fields");
}



function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function codeGen(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};