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
mongoose.connection.on('error', function() {
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
var razorController = require('./controllers/razor');

//Login APIs  //Github and linkedin auth needs testing...awaiting front end code
app.post('/api/auth/github', userController.githubAuth);
app.post('/api/auth/linkedin', userController.linkedinAuth);
app.post('/api/auth/signup', userController.signup);
app.post('/api/auth/login', userController.login);
app.post('/api/auth/facebook', userController.facebookAuth);
app.post('/api/auth/google', userController.googleAuth);
app.get('/api/users', userController.hasEmail);
app.post('/api/payment', userController.isLogin,razorController.verifyPay,emailController.sendEmail,courseController.joinCourse, emailController.sendEmail);
app.post('/api/email', emailController.contactUs, emailController.sendEmail);

//User APIs
app.post('/api/user/password', userController.isLogin, userController.changeUserPassword, emailController.sendEmail);
app.get('/api/user/:uslug', userController.isLogin, userController.getUser);
app.put('/api/user/:uslug', userController.isLogin, userController.updateProfile);
app.post('/api/newsletter', emailController.addNewsletter);

app.use(errorHandler());

//Courses
app.put('/api/courses/:cslug/join', userController.isLogin, courseController.joinCourse, emailController.sendEmail);
app.get('/api/courses/:cslug', userController.isLoginOptional, courseController.getCourse);
app.get('/api/courses', courseController.getCourses);
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
