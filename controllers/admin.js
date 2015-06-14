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
  var query = Course.find().select('name slug description price date status slots');
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
        req.body.status == "incomplete" ||
        req.body.status == "cancelled") {
      Course.findOne({slug: req.params.cslug}, function (err, course) {
        if (err) res.status(400).send(err);
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

exports.addPayment = function (req, res, next) {
  if (req.params.cslug && req.params.sid && req.body.mop && req.body.amount && req.body.status) {
    if (req.body.uid) {
      Course.findOne({slug: req.params.cslug}, function (err, course) {
        if (err) res.status(400).send(err);
        else if (!course) res.status(404).send('Course Not Found');
        else if (!course.slots.id(req.params.sid)) res.status(400).send("Invalid slot ID");
        else if (!course.slots.id(req.params.sid).attendees.id(req.body.uid)) res.status(400).send("User not part of course");
        else {
          course.slots.id(req.params.sid).attendees.id(req.body.uid).mop = req.body.mop;
          course.slots.id(req.params.sid).attendees.id(req.body.uid).amount = req.body.amount;
          course.slots.id(req.params.sid).attendees.id(req.body.uid).payment_id = req.body.payment_id;
          course.slots.id(req.params.sid).attendees.id(req.body.uid).status = req.body.status;
          course.save(function (err, course) {
            if (err) return res.status(400).send(err);
            else if (req.body.status == "paid") {
              User.findById(req.body.uid, function(err, user) {
                if (err) res.send(err);
                else if (!user) res.status(404).send('User not found');
                else {
                  req.to = user.email;
                  req.name = user.profile.fullname;
                  req.pay = true;
                  req.status = req.body.status;
                  req.coursePrice = req.body.amount;
                  req.userId = req.body.uid;
                  req.mop = req.body.mop;
                  req.courseId = course.id;
                  req.course = course.name;
                  req.courseSlug = course.slug;
                  req.courseDate = course.slots.id(req.params.sid).startDate;
                  next();
                }
              })
            } else res.status(200).send("Attendee payment updated")
          })
        }
      })
    } else res.status(400).send("User ID needed")
  } else res.status(400).send("Course slug, slot ID, MoP, status, amount needed");
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
  if (req.body.email && req.body.mop && req.body.amount 
    && req.body.paymentStatus && req.body.cslug && req.body.sid) {
    req.admin = true;
    req.pay = true;
    req.mop = req.body.mop;
    req.status = req.body.paymentStatus;
    req.coursePrice = req.body.amount;
    if (req.body.newUser && req.body.fullname && req.body.username && req.body.mobile ) {
      //creates new user
      req.body.password = codeGen(5);  
      next();
    } else {    //existing user
      req.body.newUser = false;
      User.findOne({email: req.body.email}, function (err, user) {
        if (err) res.send(err);
        else if (!user) res.status(404).send('User not found.');
        else {
          req.user = user;
          next();
        }
      })
    };
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