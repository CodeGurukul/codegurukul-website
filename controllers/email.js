var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '..', 'templates')
 /* , emailTemplates = require('email-templates') */ //Not Used currently
  , nodemailer     = require('nodemailer');
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
  console.log(req);
  req.to = 'info@codegurukul.com';
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
      if(req.pass){

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
//   var mcReq = {
//     id: config.mailchimp.id,
//     email: { email: req.body.email },
//     merge_vars: {
//         EMAIL: req.body.email,
//         FNAME: req.body.name
//     }
// };

// submit subscription request to mail chimp
mcApi.listSubscribe({id: config.mailchimp.id, email_address:req.body.email, double_optin: false}, function(err,data) {
  if(err)
    res.send(err);
  else{
    console.log(data);
    res.json({message:'Success'});
  }
});
};