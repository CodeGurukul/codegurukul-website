var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '..', 'templates')
 /* , emailTemplates = require('email-templates') */ //Not Used currently
  , nodemailer     = require('nodemailer');
var secret = require('../config/secrets');
var config = new secret();
// var config = require('../config/secrets');

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
  console.log(req);
  req.to = 'sobingt@bitbrothers.in'
  req.subject = req.body.subject;
  req.email = 'Name: ' + req.body.name + '\nEmail: ' + req.body.email + '\nContact: ' + req.body.contact + '\nMessage: ' + req.body.message ;
  next();
};
// info@codegurukul.com
exports.sendEmail = function(req, res) {
  var from = 'info@codegurukul.com';

  var mailOptions = {
    to: req.to,
    from: from,
    subject: req.subject ,
    text: req.email
  };

  transporter.sendMail(mailOptions, function(err) {
    if (err) 
      res.send(err);
    else {
        res.json({
          message:'Mail Sent'
        });
      }
  });
};