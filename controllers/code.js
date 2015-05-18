var Course = require('../models/Course');
var Code = require('../models/Code');
var secret = require('../config/secrets');
var config = new secret();
var mongoose = require('mongoose');

exports.validateCode = function(req, res) {
  console.log('Validate code');
  Code.findOne({value: req.body.value})
    .where({ courses: req.params.cslug })
    .exec(function(err, code) {
  	if (err) return res.status(400).send("There was an error.");
  	else if (!code) return res.status(400).send("Invalid code.");
  	else {
      Course.findOne({
        slug: req.params.cslug
      })
      .exec(function(err, course) {
        if (err) res.status(400).send(err);
        else if (!course) res.status(404).send('Course Not Found');
        else {
          var temp = {};
          if (code.discount) {
            //calculate discount here
          };
          temp.access = true;
          res.send(temp);
        }
      });
  	}
  })
  return;
};


// exports.assign = validateCode;
















