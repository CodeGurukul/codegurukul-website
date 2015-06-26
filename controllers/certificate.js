var User = require('../models/User');
var Course = require('../models/Course');
var email = require('../controllers/email');
var secret = require('../config/secrets');
var moment = require('moment');
var config = new secret();

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.mandrill.password);

var fs = require('fs');
var pdf = require('html-pdf');

exports.pdf = function (req, res) {
  if (req.body.cid && req.body.sid) {
    
    User.findById(req.user._id, function(err, user) {
      if (err) res.send(err);
      else if (!user) res.status(404).send("User not found");
      else if (!user.courses.id(req.body.cid)) return res.status(400).send("Course not joined");
      else {
        Course.findById(req.body.cid, function (err, course) {
          if (err) res.status(400).send(err);
          else if (!course) res.send(404).send("Course not found.");
          else if (!course.slots.id(req.body.sid)) res.status(400).send("Invalid slot ID");
          else if (!course.slots.id(req.body.sid).attendees.id(req.user._id)) res.status(400).send("Course not joined");
          else if (course.slots.id(req.body.sid).attendees.id(req.user._id).progressStatus != "completed") 
              {
                  res.status(400).send("You have not completed the course");
              }
        else
          //check if invoice exists
          fs.lstat("public/temp/certificate/" + req.body.sid + req.user._id + ".pdf", function(err, stats) {
            if (!err && stats.isFile()) {
             res.status(200).send("temp/certificate/" + req.body.sid + req.user._id + ".pdf");
            } else { 
              //if no
              
                  var template_name = "certificate_template";
                  var template_content = [];
                  var merge_vars = [{
                    "name": "mentor_1_sig",
                    "content": course.mentors[0].signature
                  }, {
                    "name": "mentor_1_name",
                    "content": course.mentors[0].name
                  }, {
                    "name": "mentor_1_des",
                    "content": course.mentors[0].designation
                  }, {
                    "name": "mentor_2_sig",
                    "content": course.mentors[1].signature
                  }, {
                    "name": "mentor_2_name",
                    "content": course.mentors[1].name
                  }, {
                    "name": "mentor_2_des",
                    "content": course.mentors[1].designation
                  }, {
                    "name": "program",
                    "content": course.name
                  }, {
                    "name": "date",
                    "content": moment(course.slots.id(req.body.sid).attendees.id(req.user._id).completionDate).format("MMM DD, YYYY")
                  }, {
                    "name": "name",
                    "content": user.profile.fullname
                  }];
                  var async = false;
                  mandrill_client.templates.render({
                    "template_name": template_name,
                    "template_content": template_content,
                    "merge_vars": merge_vars
                  }, function(result) {
                    var html = result.html;
                    var options = { filename: "public/temp/certificate/" + req.body.sid + req.user._id + ".pdf", format: "Letter" };
                    pdf.create(html, options).toFile(function(err, pdfRes) {
                      if (err) return console.log(err);
                      console.log(pdfRes); // { filename: '/tmp/html-pdf-8ymPV.pdf' } 
                      res.status(200).send("temp/certificate/" + req.body.sid + req.user._id + ".pdf");
                    });
                    return;
                  }, function(e) {
                    // Mandrill returns the error as an object with name and message keys
                    res.status(400).send("An error occured");
                    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
                  });
                
            }
          });
        })
      }
    })

  } else res.status(400).send("Course and slot ID required");
}