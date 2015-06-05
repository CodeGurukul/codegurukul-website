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
var validator = require('email-validator');
var MCapi = require('mailchimp-api');
var mcAPI = new MCapi.Mailchimp(config.mailchimp.api);

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

exports.sendSignupEmail = function(to, name, verificationCode) {
  var template_name = "welcome_template";
  var template_content = [];
  var message = {
    "from_email": "info@codegurukul.com",
    "from_name": "Codegurukul Team",
    "to": [{
      "email": to,
      "name": name,
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
      "rcpt": to,
      "vars": [{
        "name": "name",
        "content": name
      },{
        "name": "verificationCode",
        "content": verificationCode
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
    // "merge_language": "handlebars",
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

exports.sendPassword = function(to, name, password) {
  var template_name = "password_template";
  var template_content = [];
  var message = {
    "from_email": "info@codegurukul.com",
    "from_name": "Codegurukul team",
    "to": [{
      "email": to,
      "name": name,
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
    }],
    "merge_vars": [{
      "rcpt": to,
      "vars": [{
        "name": "name",
        "content": name
      }, {
        "name": "password",
        "content": password
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

exports.addNewsletter = function(req, res) {
  if (req.body.email) {
    if (!validator.validate(req.body.email))
      return res.status(400).send(msg.inem);
    // submit subscription request to mail chimp
    var mcReq = {
      id: '05bf513fcf',
      email: { email: req.body.email },
      double_optin: false,
      send_welcome: false,
      merge_vars: {
          EMAIL: req.body.email
      }
    };

    // submit subscription request to mail chimp
    mcAPI.lists.subscribe(mcReq, function(data) {
        console.log(data);
        res.status(200).send("Thank you for subscribing")
    }, function(error) {
        res.status(400).send(error.error)
        console.log(error); 
    });
  }else {
    return res.status(400).send('Email parameter is required.');
    } 
};