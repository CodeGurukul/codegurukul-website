var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '..', 'templates')
 /* , emailTemplates = require('email-templates') */ //Not Used currently
  , nodemailer     = require('nodemailer');
var User = require('../models/User');
var MailChimpAPI = require('mailchimp').MailChimpAPI;
var secret = require('../config/secrets');
var config = new secret();
// var config = require('../config/secrets');
var apiKey = config.mailchimp.api; 
try {
    var mcApi = new MailChimpAPI(apiKey, { version : '1.3', secure : false });
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



/**
 * POST /contact
 * Send a contact form via Nodemailer.
 * @param email
 * @param name
 * @param message
 */
exports.contactUs = function(req, res, next){
  // console.log(req);
  req.to = 'mail@bitbrothers.in';
  req.subject = req.body.subject;
  req.email = 'Name: ' + req.body.name + '\nEmail: ' + req.body.email + '\nContact: ' + req.body.contact + '\nMessage: ' + req.body.message ;
  next();
};
// info@codegurukul.com
exports.sendEmail = function(req, res, next) {
  var from = 'info@codegurukul.com';

  var mailOptions = {
    to: req.to,
    from: from,
    subject: req.subject ,
    text: req.email
  };
  console.log('send email');
  transporter.sendMail(mailOptions, function(err) {
    if (err) 
      res.send(err);
    else {
      if(req.pay){
        next();
      }
      else{
        res.json({
          message:'Mail Sent'
        });
      }
    }
  });
};

exports.addNewsletter = function(req, res){
  User.findOne(req.user._id, function (err, user) {
    if (err) res.send(err);
    else if (!user) res.status(404).send('User not found.');
    else{
      // submit subscription request to mail chimp
      mcApi.listSubscribe({
        id: config.mailchimp.id, 
        email_address:user.email, 
        double_optin: false
      }, function(err,data) {
        if(err)
          res.send(err);
        else{
          console.log(data);
          res.json({message:'You have been added to the mailing list.'});
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