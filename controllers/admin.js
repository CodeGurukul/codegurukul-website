var Course = require('../models/Course');
var User = require('../models/User');
var secret = require('../config/secrets');
var config = new secret();
var mongoose = require('mongoose');
var moment = require('moment');
var fs = require('fs');
var path = require('path');


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
    if (req.body.progressStatus == "completed" ||
        req.body.progressStatus == "incomplete" ||
        req.body.progressStatus == "cancelled") {
      Course.findOne({slug: req.params.cslug}, function (err, course) {
        if (err) res.status(400).send(err);
        else if (!course) res.status(404).send('Course Not Found');
        else if (!course.slots.id(req.params.sid)) res.status(400).send("Invalid slot ID");
        else {
          var result = [];
          for (var i = 0; i < req.body.users.length; i++) {
            if(course.slots.id(req.params.sid).attendees.id(req.body.users[i])) {
              course.slots.id(req.params.sid).attendees.id(req.body.users[i]).progressStatus = req.body.progressStatus; 
              if (req.body.progressStatus == "completed") 
                course.slots.id(req.params.sid).attendees.id(req.body.users[i]).completionDate = Date.now();
              result.push({
                id: req.body.users[i],
                status: req.body.progressStatus
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
  if (req.params.cslug && req.params.sid && req.body.mop && req.body.amount && req.body.paymentStatus) {
    if (req.body.uid) {
      if (req.body.mop != "Cash")
        if (!req.body.payment_id) return res.status(400).send("Payment ID required for non-cash payment");
      Course.findOne({slug: req.params.cslug}, function (err, course) {
        if (err) res.status(400).send(err);
        else if (!course) res.status(404).send('Course Not Found');
        else if (!course.slots.id(req.params.sid)) res.status(400).send("Invalid slot ID");
        else if (!course.slots.id(req.params.sid).attendees.id(req.body.uid)) res.status(400).send("User not part of course");
        else {
          course.slots.id(req.params.sid).attendees.id(req.body.uid).mop = req.body.mop;
          course.slots.id(req.params.sid).attendees.id(req.body.uid).amount = req.body.amount;
          course.slots.id(req.params.sid).attendees.id(req.body.uid).payment_id = req.body.payment_id;
          course.slots.id(req.params.sid).attendees.id(req.body.uid).paymentStatus = req.body.paymentStatus;
          course.save(function (err, course) {
            if (err) return res.status(400).send(err);
            else {
              User.findById(req.body.uid, function(err, user) {
                if (err) res.send(err);
                else if (!user) return res.status(404).send('User not found');
                else {
                  req.to = user.email;
                  req.name = user.profile.fullname;
                  req.pay = true;
                  req.paymentStatus = req.body.paymentStatus;
                  req.coursePrice = req.body.amount;
                  req.userId = req.body.uid;
                  req.mop = req.body.mop;
                  req.courseId = course.id;
                  req.course = course.name;
                  req.courseSlug = course.slug;
                  req.courseDate = course.slots.id(req.params.sid).startDate;
                  if (user.courses.id(course._id).invoice) 
                    req.invoiceId = user.courses.id(course._id).invoice;
                  next();
                }
              })
            }
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
  if (req.body.type && req.params.cslug) {
    Course.findOne({
      slug: req.params.cslug
    }, function (err, course) {
      if (err) return res.status(400).send(err);
      if (!course) return res.status(404).send("Course not found");  
      switch(req.body.type){
        case 'det':{
          updateDetails(req, res, course);
          break;
        }
        case 'stat': {
          updateStatus(req, res, course);
          break;
        }
        case 'slot': {
          updateSlot(req, res, course);
          break;
        }
        case 'ment': {
          updateMentor(req, res, course);
          break;
        }
        case 'part': {
          updatePartner(req, res, course);
          break;
        }
        case 'cont': {
          updateContent(req, res, course);
          break;
        }
        case 'test': {
          updateTestimonial(req, res, course);
          break;
        }
        default: {
          return res.status(400).send("Invalid type");    
        }
      }
    })
  } else return res.status(400).send("Type & course slug required");
}

var updateDetails = function (req, res, course) {
  course.description = req.body.description;
  course.shortDescription = req.body.shortDescription;
  if (!isNumber(req.body.price)) return res.status(400).send("Price should be a positive number");
  course.price = req.body.price;
  course.tech = req.body.tech;
  course.duration = req.body.duration;
  course.inviteOnly = req.body.inviteOnly;
  if (course.inviteOnly) course.inviteMessage = req.body.inviteMessage;
  saveCourse(req, res, course);
}

var updateStatus = function (req, res, course) {
  if (req.body.status == "published") {
    if (course.description && 
    course.shortDescription && 
    course.price && 
    course.tech &&
    course.duration &&
    course.slots.length) {
      course.status = req.body.status;
      saveCourse(req, res, course);
    } else return res.status(400).send("Fill all required course details before publishing");
  } else if (req.body.status == "unpublished") {
    course.status = req.body.status;
    saveCourse(req, res, course);
  } else return res.status(400).send("Invalid status");
}

var updateSlot = function (req, res, course) {
  if (req.body.slotId) { //existing slot
    if (course.slots.id(req.body.slotId)) {
      if (req.body.startDate) {
        var now = moment();
        if (!moment(req.body.startDate).isSame(course.slots.id(req.body.slotId).startDate, "day")) {
          if (moment(req.body.startDate).isBefore(now)) 
            return res.status(400).send("Start date can not be in the past");
          else
            course.slots.id(req.body.slotId).startDate = req.body.startDate;      
        }
      };
      course.slots.id(req.body.slotId).city = req.body.city;
      if (!isNumber(req.body.batchSize)) return res.status(400).send("Batch size should be a positive number");
      course.slots.id(req.body.slotId).batchSize = req.body.batchSize;
      course.slots.id(req.body.slotId).location = req.body.location;
      if (req.body.status) {
        if (req.body.status == "unpublished" ||
        req.body.status == "new" ||
        req.body.status == "closed" ||
        req.body.status == "open") {
          course.slots.id(req.body.slotId).status = req.body.status;
        } else return res.status(400).send("Invalid slot status");
      }; 
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid slot ID");
  } else { //new slot
    if (req.body.status) {
      if (req.body.status == "unpublished" ||
      req.body.status == "new" ||
      req.body.status == "closed" ||
      req.body.status == "open") {
        //nothing
      } else return res.status(400).send("Invalid slot status");
    }; 
    if (!isNumber(req.body.batchSize)) return res.status(400).send("Batch size should be a positive number");
    if (req.body.startDate) {
      var now = moment();
      if (moment(req.body.startDate).isBefore(now)) 
        return res.status(400).send("Start date can not be in the past");     
    };
    course.slots.push({
      startDate: req.body.startDate,
      city: req.body.city,
      batchSize: req.body.batchSize,
      location: req.body.location,
      status: req.body.status
    });
    saveCourse(req, res, course);
  }
}

var updateMentor = function (req, res, course) {
  if (!req.body.name) return res.status(400).send("Mentor name required");     
  if (req.body.mentorId) {
    if (course.mentors.id(req.body.mentorId)) {
      course.mentors.id(req.body.mentorId).name = req.body.name;
      course.mentors.id(req.body.mentorId).description = req.body.description;
      course.mentors.id(req.body.mentorId).designation = req.body.designation;
      course.mentors.id(req.body.mentorId).facebook = req.body.facebook;
      course.mentors.id(req.body.mentorId).linkedin = req.body.linkedin;
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid mentor ID");
  } else {
    course.mentors.push({
      name: req.body.name,
      description: req.body.description,
      facebook: req.body.facebook,
      linkedin: req.body.linkedin,
      designation: req.body.designation
    });
    saveCourse(req, res, course);
  }
}

var updatePartner = function (req, res, course) {
  if (!req.body.name) return res.status(400).send("Partner name required");     
  if (req.body.partnerId) {
    if (course.partners.id(req.body.partnerId)) {
      course.partners.id(req.body.partnerId).name = req.body.name;
      course.partners.id(req.body.partnerId).link = req.body.link;
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid partner ID");
  } else {
    course.partners.push({
      name: req.body.name,
      link: req.body.link
    });
    saveCourse(req, res, course);
  }
}

var updateContent = function (req, res, course) {
  if (!req.body.title) return res.status(400).send("Content title required");     
  if (req.body.contentId) {
    if (course.content.id(req.body.contentId)) {
      course.content.id(req.body.contentId).title = req.body.title;
      course.content.id(req.body.contentId).description = req.body.description;
      course.content.id(req.body.contentId).duration = req.body.duration;
      course.content.id(req.body.contentId).difficulty = req.body.difficulty;
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid content ID");
  } else {
    course.content.push({
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      difficulty: req.body.difficulty
    });
    saveCourse(req, res, course);
  }
}

var updateTestimonial = function (req, res, course) {
  if (!req.body.name) return res.status(400).send("Testimonial name required");     
  if (req.body.testimonialId) {
    if (course.testimonials.id(req.body.testimonialId)) {
      course.testimonials.id(req.body.testimonialId).name = req.body.name;
      course.testimonials.id(req.body.testimonialId).description = req.body.description;
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid testimonial ID");
  } else {
    course.testimonials.push({
      name: req.body.name,
      description: req.body.description
    });
    saveCourse(req, res, course);
  }
}

var saveCourse = function (req, res, course) {
  course.save(function (err, course) {
    if (err) return res.status(400).send(err);
    else {
      res.status(200).send("Course updated successfully");
    }
  })
}

exports.deleteCourse = function (req, res) {
    console.log(req.query.type + " "+ req.params.cslug);
  if (req.query.type && req.params.cslug) {
    Course.findOne({
      slug: req.params.cslug
    }, function (err, course) {
      if (err) return res.status(400).send(err);
      if (!course) return res.status(404).send("Course not found");  
      switch(req.query.type){
        case 'slot': {
          deleteSlot(req, res, course);
          break;
        }
        case 'ment': {
          deleteMentor(req, res, course);
          break;
        }
        case 'part': {
          deletePartner(req, res, course);
          break;
        }
        case 'cont': {
          deleteContent(req, res, course);
          break;
        }
        case 'test': {
          deleteTestimonial(req, res, course);
          break;
        }
        case 'course': {
          course.remove(function (err, course) {
            if (err) return res.status(400).send(err);
            else {
              res.status(200).send("Course deleted");
            }
          })
          break;
        }
        default: {
          return res.status(400).send("Invalid type");    
        }
      }
    })
  } else return res.status(400).send("Type & course slug required");
}

var deleteSlot = function (req, res, course) {
  if (req.query.slotId) {
    if (course.slots.id(req.query.slotId)) {
      course.slots.pull({_id: req.query.slotId})
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid slot ID");
  } else return res.status(400).send("Slot ID required");
}

var deleteMentor = function (req, res, course) {
  if (req.query.mentorId) {
    if (course.mentors.id(req.query.mentorId)) {
      if (course.mentors.id(req.query.mentorId).image) 
        deleteFile(course.mentors.id(req.query.mentorId).image);
      if (course.mentors.id(req.query.mentorId).signature) 
        deleteFile(course.mentors.id(req.query.mentorId).signature);
      course.mentors.pull({_id: req.query.mentorId})
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid mentor ID");
  } else return res.status(400).send("Mentor ID required");
}

var deletePartner = function (req, res, course) {
  if (req.query.partnerId) {
    if (course.partners.id(req.query.partnerId)) {
      if (course.partners.id(req.query.partnerId).image)
        deleteFile(course.partners.id(req.query.partnerId).image);
      course.partners.pull({_id: req.query.partnerId})
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid partner ID");
  } else return res.status(400).send("Partner ID required");
}

var deleteContent = function (req, res, course) {
  if (req.query.contentId) {
    if (course.content.id(req.query.contentId)) {
      course.content.pull({_id: req.query.contentId})
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid content ID");
  } else return res.status(400).send("Content ID required");
}

var deleteTestimonial = function (req, res, course) {
  if (req.query.testimonialId) {
    if (course.testimonials.id(req.query.testimonialId)) {
      if (course.testimonials.id(req.query.testimonialId).image)
        deleteFile(course.testimonials.id(req.query.testimonialId).image);
      course.testimonials.pull({_id: req.query.testimonialId})
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid testimonial ID");
  } else return res.status(400).send("Testimonial ID required");
}

exports.joinPrep = function (req, res, next) {
  if (req.body.email && req.body.mop && req.body.amount 
    && req.body.paymentStatus && req.body.cslug && req.body.sid) {
    if (req.body.mop != "Cash")
      if (!req.body.payment_id) return res.status(400).send("Payment ID required for non-cash payment");
    req.admin = true;
    req.pay = true;
    req.mop = req.body.mop;
    req.paymentStatus = req.body.paymentStatus;
    req.coursePrice = req.body.amount;
    if (req.body.newUser) {
      if (req.body.fullname && req.body.username && req.body.mobile ) {
        //creates new user
        req.body.password = codeGen(5);  
        req.existingUser = !req.body.newUser;
        next();
      } else res.status(400).send("Enter all required fields");
    } else {    //existing user
      req.existingUser = true
      User.findOne({email: req.body.email}, function (err, user) {
        if (err) res.send(err);
        else if (!user) res.status(404).send("User not found");
        else {
          req.user = user;
          next();
        }
      })
    };
  } else return res.status(400).send("Enter all required fields");
}

exports.uploadImages = function(req, res) {
  
  if (req.body.type && req.params.cslug) {
    Course.findOne({
      slug: req.params.cslug
    }, function (err, course) {
      if (err) return res.status(400).send(err);
      if (!course) return res.status(404).send("Course not found");  
      var file = req.files.file;
      var filename = path.basename(file.path);
      var dir = path.dirname(file.path);
      var newPath = path.resolve(dir,"..") + "/public/img/course/" + course.slug + "/" + filename;
      var newDir = path.resolve(dir,"..") + "/public/img/course/" + course.slug;
        // Query the entry
      fs.stat(newDir, function (err) {
        if (err)
          if(err.errno = 34) {
            fs.mkdirSync(newDir);
          } else return res.status(400).send(err);
        fs.rename(file.path, newPath, function (err) {
          if (err) return res.status(400).send(err);
          else {
            switch(req.body.type){
            case 'course': {
              if (req.body.imageType) {
                courseImage(req, res, course);
              } else return res.status(400).send("Course image type required");  
              break;
            }
            case 'ment': {
              if (req.body.imageType) {
                mentorImage(req, res, course);
              } else return res.status(400).send("Mentor image type required");  
              break;
            }
            case 'part': {
              partnerImage(req, res, course);
              break;
            }
            case 'test': {
              testimonialImage(req, res, course);
              break;
            }
            default: {
              return res.status(400).send("Invalid type");    
            }
          }
          }
        })
      });
      
    })
  } else return res.status(400).send("Type & course slug required");
};

var courseImage = function (req, res, course) {
    var filename = path.basename(req.files.file.path);
    if (req.body.imageType == "thumb"){
      course.thumb = "img/course/" + course.slug + "/" + filename;
    } else return res.status(400).send("Invalid course image type");    
    saveCourse(req, res, course);
}

var mentorImage = function (req, res, course) {
  if (req.body.mentorId) {
    if (course.mentors.id(req.body.mentorId)) {
      var filename = path.basename(req.files.file.path);
      if (req.body.imageType == "dp"){
        course.mentors.id(req.body.mentorId).image = "img/course/" + course.slug + "/" + filename;
      } else if (req.body.imageType == "sig") {
        course.mentors.id(req.body.mentorId).signature = "img/course/" + course.slug + "/" + filename;
      } else return res.status(400).send("Invalid mentor image type");    
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid mentor ID");

  } else return res.status(400).send("Mentor ID required");
}

var partnerImage = function (req, res, course) {
  if (req.body.partnerId) {
    if (course.partners.id(req.body.partnerId)) {
      var filename = path.basename(req.files.file.path);
      course.partners.id(req.body.partnerId).image = "img/course/" + course.slug + "/" + filename;
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid partner ID");

  } else return res.status(400).send("Partner ID required");
}

var testimonialImage = function (req, res, course) {
  if (req.body.testimonialId) {
    if (course.testimonials.id(req.body.testimonialId)) {
      var filename = path.basename(req.files.file.path);
      course.testimonials.id(req.body.testimonialId).image = "img/course/" + course.slug + "/" + filename;
      saveCourse(req, res, course);
    } else return res.status(400).send("Invalid testimonial ID");

  } else return res.status(400).send("Testimonial ID required");
}

exports.deleteImages = function(req, res) {
  
  if (req.query.type && req.params.cslug) {
    Course.findOne({
      slug: req.params.cslug
    }, function (err, course) {
      if (err) return res.status(400).send(err);
      if (!course) return res.status(404).send("Course not found");  
      switch(req.query.type){
        case 'course': {
          if (req.query.imageType) {
            deleteCourseImage(req, res, course);
          } else return res.status(400).send("Course image type required");  
          break;
        }
        case 'ment': {
          if (req.query.imageType) {
            deleteMentorImage(req, res, course);
          } else return res.status(400).send("Mentor image type required");  
          break;
        }
        case 'part': {
          deletePartnerImage(req, res, course);
          break;
        }
        case 'test': {
          deleteTestimonialImage(req, res, course);
          break;
        }
        default: {
          return res.status(400).send("Invalid type");    
        }
      }
    })
  } else return res.status(400).send("Type & course slug required");
};

var deleteCourseImage = function (req, res, course) {
    if (req.query.imageType == "thumb"){
      if(course.thumb) {
        deleteFile(course.thumb);
        course.thumb = undefined;
        saveCourse(req, res, course);
      } else return res.status(400).send("No image exists");
    } else return res.status(400).send("Invalid course image type");
}

var deleteMentorImage = function (req, res, course) {
  if (req.query.mentorId) {
    if (course.mentors.id(req.query.mentorId)) {
      if (req.query.imageType == "dp"){
        if(course.mentors.id(req.query.mentorId).image) {
          deleteFile(course.mentors.id(req.query.mentorId).image);
          course.mentors.id(req.query.mentorId).image = undefined;
          saveCourse(req, res, course);
        } else return res.status(400).send("No image exists");
      } else if (req.query.imageType == "sig") {
        if(course.mentors.id(req.query.mentorId).signature) {
          deleteFile(course.mentors.id(req.query.mentorId).signature);
          course.mentors.id(req.query.mentorId).signature = undefined;
          saveCourse(req, res, course);
        } else return res.status(400).send("No image exists");

      } else return res.status(400).send("Invalid mentor image type");    

    } else return res.status(400).send("Invalid mentor ID");

  } else return res.status(400).send("Mentor ID required");
}

var deletePartnerImage = function (req, res, course) {
  if (req.query.partnerId) {
    if (course.partners.id(req.query.partnerId)) {
      if(course.partners.id(req.query.partnerId).image) {
        deleteFile(course.partners.id(req.query.partnerId).image);
        course.partners.id(req.query.partnerId).image = undefined;
        saveCourse(req, res, course);
      } else return res.status(400).send("No image exists");

    } else return res.status(400).send("Invalid partner ID");

  } else return res.status(400).send("Partner ID required");
}

var deleteTestimonialImage = function (req, res, course) {
  if (req.query.testimonialId) {
    if (course.testimonials.id(req.query.testimonialId)) {
      if(course.testimonials.id(req.query.testimonialId).image) {
        deleteFile(course.testimonials.id(req.query.testimonialId).image);
        course.testimonials.id(req.query.testimonialId).image = undefined;
        saveCourse(req, res, course);
      } else return res.status(400).send("No image exists");

    } else return res.status(400).send("Invalid testimonial ID");

  } else return res.status(400).send("Testimonial ID required");
}

var deleteFile = function (file) {
  fs.unlink(path.resolve('public/', file), function (err) {
    if (err) console.log(err);
    else console.log('successfully deleted');
  });
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n) && n > -1;
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