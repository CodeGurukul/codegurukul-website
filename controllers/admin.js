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
  .populate({
    path: 'attendees._id',
    select: 'slug email username'
  })
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






function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};