var Course = require('../models/Course');
var Code = require('../models/Code');
var code = require('../controllers/code');
var secret = require('../config/secrets');
var config = new secret();
var mongoose = require('mongoose');

exports.validate = function(code, cslug, callback) {
  console.log("validate code");
  if (code) {
    console.log("code exists");
    Code.findOne({value: code.toUpperCase()})
    .where({ courses: cslug })
    .exec(function(err, code) {
    	if (err) return callback({status:400,value: "There was an error."});
    	else if (!code) {
        return callback({status:400,value: "Invalid code."});
      }
    	else {
        Course.findOne({
          slug: cslug
        })
        .exec(function(err, course) {
          if (err) return err;
          else if (!course) return callback({status:404,value: "Course Not Found"});
          else {
            var coursePrice = course.price;
            var temp = {};
            if (code.discount) {
              coursePrice = course.price - (code.discountValue*course.price)/100;
            };
            return callback({status:200,value: coursePrice});
          }
        });
    	}
    })
  } else {
    console.log("no code entered");
    console.log(cslug);

    Course.findOne({
      slug: cslug
    })
    .exec(function(err, course) {
      if (err) return err;
      else if (!course) return callback({status:404, value: "Course Not Found"});
      else if (course.inviteOnly) return callback({status:400, value: "Course is invite only"});
      else {
        return callback({status:200,value: course.price});
      }
    });
  }
  return;
};


exports.validateCode = function (req, res) {
  console.log("validateCode");
  console.log(req.query);
  if (req.query.code) {
    code.validate(req.query.code, req.params.cslug, function(result) {
      console.log(result);
      res.status(result.status).send({result:result.value});
    })
  } else res.status(400).send("Enter a code");
}

// exports.assign = validateCode;
















