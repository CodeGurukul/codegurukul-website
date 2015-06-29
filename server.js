/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');


var _ = require('lodash');
var path = require('path');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;


/**
 * Controllers (route handlers).
 */



/**
 * API keys and Passport configuration.
 */
var config = require('./config/secrets');
var secrets = config();

/**
 * Create Express server.
 */

var app = express();

/**
 * Connect to MongoDB.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var hour = 3600000;
var day = hour * 24;
var week = day * 7;


/**
 * Express configuration.
 */

app.set('port', process.env.PORT || secrets.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));
app.locals.moment = require('moment');

app.get('/', function(request, response){
    response.render('home');
});

var emailController = require('./controllers/email');
var userController = require('./controllers/user');
var courseController = require('./controllers/course');
var badgeController = require('./controllers/badge');
var codeController = require('./controllers/code');
var razorController = require('./controllers/razor');
var invoiceController = require('./controllers/invoice');
var certificateController = require('./controllers/certificate');
var adminController = require('./controllers/admin');

//Login APIs  //Github and linkedin auth needs testing...awaiting front end code
app.post('/api/auth/github', userController.githubAuth);
app.post('/api/auth/linkedin', userController.linkedinAuth);
app.post('/api/auth/signup', userController.signup);
app.post('/api/auth/signup/resend', userController.signupResend);
app.post('/api/auth/signup/verification', userController.signupVerify);
app.post('/api/auth/login', userController.login);
app.post('/api/auth/facebook', userController.facebookAuth);
app.post('/api/auth/google', userController.googleAuth);
app.get('/api/users', userController.hasEmail);
app.post('/api/email', emailController.contactUs, emailController.sendEmail);

//User
//app.post('/api/user/password', userController.isLogin, userController.changeUserPassword, emailController.sendEmail);
app.get('/api/user/:uslug', userController.isLogin, userController.getUser);
app.put('/api/user/:uslug', userController.isLogin, userController.updateProfile);
app.post('/api/user/:uslug/invoicePdf', userController.isLogin, invoiceController.pdf);
app.post('/api/user/:uslug/certificatePdf', userController.isLogin, certificateController.pdf);
app.post('/api/newsletter', emailController.addNewsletter);

app.use(errorHandler());

//Courses
//app.put('/api/courses/:cslug/:sid/join', userController.isLogin, courseController.joinCourse);
app.post('/api/courses/join', userController.isLogin, razorController.verifyPay, courseController.joinCourse, invoiceController.generate);
app.get('/api/courses/:cslug/:sid/canjoin', userController.isLogin, courseController.canJoin);
app.post('/api/courses/:cslug/addlead', userController.isLogin, courseController.leadPre);
app.get('/api/courses/:cslug', userController.isLoginOptional, courseController.getCourse);
app.get('/api/courses', courseController.getCourses);

//Badges
app.get('/api/badges', userController.isLogin, badgeController.getBadges);

//Codes
app.get('/api/codes/:cslug/validateCode', codeController.validateCode);


//Admin calls
app.get('/api/admin/courses/:cslug/:sid/attendees', userController.isAdmin, adminController.getAttendees);
app.post('/api/admin/courses/:cslug/:sid/attendees/status', userController.isAdmin, adminController.changeAttendeeStatus);
app.post('/api/admin/courses/:cslug/:sid/attendees/addPayment', userController.isAdmin, adminController.addPayment, invoiceController.generate);
app.get('/api/admin/courses/:cslug/:sid/leads', userController.isAdmin, adminController.getLeads);
app.post('/api/admin/courses/:cslug/update', userController.isAdmin, adminController.updateCourse);
app.get('/api/admin/courses/:cslug', userController.isAdmin, adminController.getCourse);
app.post('/api/admin/createCourse', userController.isAdmin, adminController.createCourse);
app.post('/api/admin/courses/join', userController.isAdmin, adminController.joinPrep, userController.signup, courseController.joinCourse, invoiceController.generate);
app.get('/api/admin/courses', userController.isAdmin, adminController.getCourses);
app.get('/api/admin/users', userController.isAdmin, adminController.getUsers);
/**
 * Start Express server.
 */

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
