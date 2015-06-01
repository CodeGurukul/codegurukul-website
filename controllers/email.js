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
  req.to = 'info@codegurukul.com';
  req.subject = req.body.subject;
  req.email = 'Name: ' + req.body.name + '\nEmail: ' + req.body.email + '\nContact: ' + req.body.contact + '\nMessage: ' + req.body.message;
  next();
};
// info@codegurukul.com
exports.sendCourseReg = function(data) {
  var template_name = "register_template";
  var template_content = [];
  var message = {
    "from_email": "info@codegurukul.com",
    "from_name": "Codegurukul team",
    "to": [{
      "email": data.to,
      "name": data.userName,
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
      "content": "Registration for " + data.course
    }],
    "merge_vars": [{
      "rcpt": data.to,
      "vars": [{
        "name": "name",
        "content": data.userName
      }, {
        "name": "courseName",
        "content": data.course
      }, {
        "name": "courseDate",
        "content": moment(data.courseDate).format("MMM DD, YYYY")
      }, {
        "name": "courseLink",
        "content": "codegurukul.com/#/programs/" + data.courseSlug
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
    return;
  }, function(e) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
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
      },{
        "name": "verificationCode",
        "content": req.verificationCode
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

exports.sendInvoice = function(invoice, data) {
  var template_name = "invoice_template";
  console.log(invoice.invoiceNo);
  var template_content = [];
  var message = {
    "from_email": "info@codegurukul.com",
    "from_name": "Codegurukul Team",
    "to": [{
      "email": data.to,
      "name": data.userName,
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
      "rcpt": data.to,
      "vars": [{
        "name": "invNumber",
        "content": invoice.invoiceNo
      }, {
        "name": "invDate",
        "content": moment(invoice.created).format("MMM DD, YYYY")
      }, {
        "name": "courseName",
        "content": invoice.products[0].product
      }, {
        "name": "coursePrice",
        "content": invoice.products[0].total
      }, {
        "name": "courseDate",
        "content": moment(invoice.products[0].date).format("MMM DD, YYYY")
      }, {
        "name": "name",
        "content": data.userName
      }, {
        "name": "email",
        "content": data.to
      }]
    }]
  };
  console.log(message);
  var async = false;
  mandrill_client.messages.sendTemplate({
    "template_name": template_name,
    "template_content": template_content,
    "message": message,
    "async": async
  }, function(result) {
    return;
  }, function(e) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
  });
};

exports.addNewsletter = function(req, res) {
  if (req.body.email) {
    if (!validator.validate(req.body.email))
      return res.status(400).send(msg.inem);
    // submit subscription request to mail chimp
    mcApi.listSubscribe({
      id: config.mailchimp.id,
      email_address: req.body.email,
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
  }else {
    return res.status(400).send('Email parameter is required.');
    }

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