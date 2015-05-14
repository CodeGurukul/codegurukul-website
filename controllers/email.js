var path = require('path'),
  templatesDir = path.resolve(__dirname, '..', 'templates')
  /* , emailTemplates = require('email-templates') */ //Not Used currently
  ,
  nodemailer = require('nodemailer');
var User = require('../models/User');
var moment = require('moment');
var MailChimpAPI = require('mailchimp').MailChimpAPI;
var secret = require('../config/secrets');
var config = new secret();
// var config = require('../config/secrets');
var apiKey = config.mailchimp.api;
try {
  var mcApi = new MailChimpAPI(apiKey, {
    version: '1.3',
    secure: false
  });
} catch (error) {
  console.log(error.message);
}

var transporter = nodemailer.createTransport({
  service: 'Mandrill',
  auth: {
    user: config.mandrill.user,
    pass: config.mandrill.password
  }
});

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.mandrill.password);


/**
 * POST /contact
 * Send a contact form via Nodemailer.
 * @param email
 * @param name
 * @param message
 */
exports.contactUs = function(req, res, next) {
  // console.log(req);
  req.to = 'mail@bitbrothers.in';
  req.subject = req.body.subject;
  req.email = 'Name: ' + req.body.name + '\nEmail: ' + req.body.email + '\nContact: ' + req.body.contact + '\nMessage: ' + req.body.message;
  next();
};
// info@codegurukul.com
exports.sendRegistrationEmail = function(req, res, next) {
  var template_name = "register_template";
  var template_content = [];
  var message = {
    "from_email": "info@codegurukul.com",
    "from_name": "Codegurukul team",
    "to": [{
      "email": req.to,
      "name": req.name,
      "type": "to"
    }],
    "headers": {
      "Reply-To": "info@codegurukul.com"
    },
    "auto_text": true,
    "inline_css": true,
    "merge": true,
    "merge_language": "handlebars",
    "global_merge_vars": [{
      "name": "companyName",
      "content": "Codegurukul"
    }, {
      "name": "subject",
      "content": "Registration for " + req.course
    }],
    "merge_vars": [{
      "rcpt": req.to,
      "vars": [{
        "name": "name",
        "content": req.name
      }, {
        "name": "courseName",
        "content": req.course
      }, {
        "name": "courseDate",
        "content": req.courseDate
      }, {
        "name": "courseLink",
        "content": "codegurukul.com/#/programs/" + req.courseSlug
      }]
    }]
  };
  var async = false;
  mandrill_client.messages.sendTemplate({
    "template_name": template_name,
    "template_content": template_content,
    "message": message,
    "async": async
  }, function(result) {
    console.log(result);
    res.json({
      message: 'Mail Sent'
    });

    var dat = moment().format("MMM DD, YYYY");

    console.log(dat);
  }, function(e) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    res.status(400).send("An error occured");
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
  });
};

exports.sendEmail = function(req, res, next) {
  var from = 'info@codegurukul.com';

  var mailOptions = {
    to: req.to,
    from: from,
    subject: req.subject,
    text: req.email
  };
  transporter.sendMail(mailOptions, function(err) {
    if (err)
      res.send(err);
    else {
      if (req.pay) {
        next();
      } else {
        res.json({
          message: 'Mail Sent'
        });
      }
    }
  });
};

exports.sendSignupEmail = function(req, res, next) {
  var template_name = "welcome_template";
  var template_content = [];
  var message = {
    "from_email": "info@codegurukul.com",
    "from_name": "Codegurukul Team",
    "to": [{
      "email": req.to,
      "name": req.name,
      "type": "to"
    }],
    "headers": {
      "Reply-To": "info@codegurukul.com"
    },
    "auto_text": true,
    "inline_css": true,
    "merge": true,
    "merge_language": "handlebars",
    "global_merge_vars": [{
      "name": "companyName",
      "content": "Codegurukul"
    }, {
      "name": "subject",
      "content": "Welcome to Codegurukul"
    }],
    "merge_vars": [{
      "rcpt": req.to,
      "vars": [{
        "name": "name",
        "content": req.name
      }]
    }]
  };
  var async = false;
  mandrill_client.messages.sendTemplate({
    "template_name": template_name,
    "template_content": template_content,
    "message": message,
    "async": async
  }, function(result) {
    console.log(result);
  }, function(e) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
  });
};

exports.sendRecieptEmail = function(req, res, next) {
  var template_name = "invoice_template";
  var template_content = [];
  var message = {
    "from_email": "info@codegurukul.com",
    "from_name": "Codegurukul Team",
    "to": [{
      "email": req.to,
      "name": req.name,
      "type": "to"
    }],
    "headers": {
      "Reply-To": "info@codegurukul.com"
    },
    "auto_text": true,
    "inline_css": true,
    "merge": true,
    "merge_language": "handlebars",
    "global_merge_vars": [{
      "name": "companyName",
      "content": "Codegurukul"
    }, {
      "name": "subject",
      "content": "Payment reciept for your course."
    }],
    "merge_vars": [{
      "rcpt": req.to,
      "vars": [{
        "name": "invNumber",
        "content": "478366238"
      }, {
        "name": "invDate",
        "content": moment().format("MMM DD, YYYY")
      }, {
        "name": "courseName",
        "content": req.course
      }, {
        "name": "coursePrice",
        "content": req.coursePrice
      }, {
        "name": "courseDate",
        "content": req.courseDate
      }, {
        "name": "name",
        "content": req.name
      }]
    }]
  };
  var async = false;
  mandrill_client.messages.sendTemplate({
    "template_name": template_name,
    "template_content": template_content,
    "message": message,
    "async": async
  }, function(result) {
    console.log(result);
    next();
  }, function(e) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
  });
};

exports.addNewsletter = function(req, res) {
  User.findOne(req.user._id, function(err, user) {
    if (err) res.send(err);
    else if (!user) res.status(404).send('User not found.');
    else {
      // submit subscription request to mail chimp
      mcApi.listSubscribe({
        id: config.mailchimp.id,
        email_address: user.email,
        double_optin: false
      }, function(err, data) {
        if (err)
          res.send(err);
        else {
          console.log(data);
          res.json({
            message: 'You have been added to the mailing list.'
          });
        }
      });
    }
  });
  //   var mcReq = {
  //     id: config.mailchimp.id,
  //     email: { email: req.body.email },
  //     merge_vars: {
  //         EMAIL: req.body.email,
  //         FNAME: req.body.name
  //     }
  // };

  // 
};