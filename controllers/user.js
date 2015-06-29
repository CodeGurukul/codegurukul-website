var jwt = require('jwt-simple');
var moment = require('moment');
var crypto = require('crypto');
var path = require('path');
var course = require('../controllers/course');
var email = require('../controllers/email');
var secrets = require('../config/secrets');
var config = secrets();
var msg = require('../messages');
var validator = require('email-validator');
/**
 * Model.
 */
var User = require('../models/User');

var tokenSecret = config.sessionSecret;



function createJwtToken(user) {
  var temp = {
    _id: user._id,
    slug: user.slug,
    role: user.role
  };
  var payload = {
    user: temp,
    iat: new Date().getTime(),
    exp: moment().add(7, 'days').valueOf()
  };
  return jwt.encode(payload, tokenSecret);
};

exports.isLoginOptional = function(req, res, next) {
  if (req.headers.authorization) {
    var token = req.headers.authorization;
    //.split(' ')[1];
    try {
      var decoded = jwt.decode(token, tokenSecret);
      if (decoded.exp <= Date.now()) {
        res.status(400).send(msg.et);
      } else {
        req.user = decoded.user;
        return next();
      }
    } catch (err) {
      req.user = false;
      return next();
    }
  } else {
    req.user = false;
    return next();

  }
};

exports.isLogin = function(req, res, next) {
  if (req.headers.authorization) {
    var token = req.headers.authorization;
    //.split(' ')[1];
    try {
      var decoded = jwt.decode(token, tokenSecret);
      if (decoded.exp <= Date.now()) {
        res.status(400).send(msg.et);
      } else {
        req.user = decoded.user;
        return next();
      }
    } catch (err) {
      return res.status(500).send(msg.at);
    }
  } else {
    if (req.flag) {
      // next();
    } else {
      res.status(401).send(msg.unauth);
    }

  }
};

exports.isAdmin = function(req, res, next) {
  if (req.headers.authorization) {
    var token = req.headers.authorization;
    //.split(' ')[1];
    try {
      var decoded = jwt.decode(token, tokenSecret);
      if (decoded.user.role == 'admin') {
        if (decoded.exp <= Date.now()) {
          res.status(404).send(msg.et);
        } else {
          req.user = decoded.user;
          return next();
        }
      } else {
        return res.status(404).send(msg.unauth);
      }
    } catch (err) {
      return res.status(404).send(msg.at);
    }
  } else {
    res.status(404).send(msg.unauth);
  }
};

exports.signup = function(req, res, next) {
  if (req.existingUser) {
    return next();
  }
  if (!validator.validate(req.body.email))
    return res.status(400).send(msg.inem);
  var user = new User({
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    mobile: req.body.mobile,
    profile: {
      fullname: req.body.fullname,
      type: req.body.type,
      college: req.body.college,
      year: req.body.year,
      stream: req.body.stream,
      organization: req.body.organization,
      workDesc: req.body.workDesc
    }
  });
  if (req.body.referalCode) {
    user.extReferalCode = req.body.referalCode;
  };
  user.save(function(err, user, numberAffected) {
    if (err) res.status(400).send(err);
    else {
      if(!req.admin) res.status(200).send(msg.signup);
      email.sendSignupEmail(user.email, user.username, user.verificationCode); 
      if (req.body.lead) 
        if (req.body.lead.cslug && req.body.lead.sid) course.addLead(user.id, req.body.lead.cslug, req.body.lead.sid);
      if (req.admin) {
        email.sendPassword(user.email, user.username, req.body.password);     
        req.user = user;
        next();
      }
    }

  });
};

exports.signupResend = function (req, res) {
  if (!validator.validate(req.body.email))
    return res.status(400).send(msg.inem);
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (!user) return res.status(401).send(msg.unf);
    if (user.verified) return res.status(200).send(msg.alver);
    email.sendSignupEmail(user.email, user.username, user.verificationCode); 
    res.status(200).send(msg.verifySent);
  });
};

exports.signupVerify = function (req, res) {
  if (!req.body.verificationCode)
    return res.status(400).send(msg.inco);
  User.findOne({
    verificationCode: req.body.verificationCode
  }, function(err, user) {
    if (!user) return res.status(401).send(msg.inco);
    if (user.verified) return res.status(200).send(msg.alver);
    user.verified = true;
    User.findOne({
      referalCode: user.extReferalCode
    }, function(err, refUser) {
      if (!refUser) {
        user.points = 0;
      } else{
        refUser.points = refUser.points + 100;
        user.points = 100;
        refUser.save(function(err, refUser, numberAffected) {
          if(err) console.log(err);
        })
      };
      user.save(function(err, user, numberAffected) {
        if (err) res.status(400).send(err);
        else {
          res.status(200).send(msg.verified);
        }

      });
    })
  });
};

exports.login = function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (!user) return res.status(401).send(msg.unf);
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) return res.status(401).send(msg.inep);
      if (!user.verified) return res.status(410).send(msg.ntver);
      var token = createJwtToken(user);
      var temp = {
        username: user.username,
        slug: user.slug,
        role: user.role
      };
      console.log(temp);
      res.send({
        token: token,
        user: temp
      });
    });
  });
};

exports.githubAuth = function(req, res) { //user model structure changed (slug, username moved out of profile)
  var profile = req.body.profile;
  User.findOne({
    email: profile.emails[0].value
  }, function(err, existingUser) {
    if (err) res.send(err);

    if (existingUser) {
      console.log('heere');
      var token = createJwtToken(existingUser);
      var tempy = {
        profile: existingUser.profile
      };
      return res.send({
        token: token,
        user: tempy
      });
    }
    var user = new User();
    user.profile.name = profile.displayName;
    user.email = profile.emails[0].value;
    user.save(function(err) {
      if (err) return next(err);
      else {
        var token = createJwtToken(user);
        var tempy = {
          profile: user.profile
        };
        res.send({
          token: token,
          user: tempy
        });
      }

    });
  });
};

exports.linkedinAuth = function(req, res) { //user model structure changed (slug, username moved out of profile)
  var profile = req.body.profile;
  User.findOne({
    email: profile.emails[0].value
  }, function(err, existingUser) {
    if (err) res.send(err);

    if (existingUser) {
      console.log('heere');
      var token = createJwtToken(existingUser);
      var tempy = {
        profile: existingUser.profile
      };
      return res.send({
        token: token,
        user: tempy
      });
    }
    var user = new User();
    user.profile.name = profile.displayName;
    user.email = profile.emails[0].value;
    user.save(function(err) {
      if (err) return next(err);
      else {
        var token = createJwtToken(user);
        var tempy = {
          profile: user.profile
        };
        res.send({
          token: token,
          user: tempy
        });
      }

    });
  });
};

exports.facebookAuth = function(req, res) { //user model structure changed (slug, username moved out of profile)
  var profile = req.body.profile;
  var signedRequest = req.body.signedRequest;
  var encodedSignature = signedRequest.split('.')[0];
  var payload = signedRequest.split('.')[1];

  var appSecret = 'fc5a36cb1fa441c60b629ee6bc65bc85';

  var expectedSignature = crypto.createHmac('sha256', appSecret).update(payload).digest('base64');
  expectedSignature = expectedSignature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  if (encodedSignature !== expectedSignature) {
    return res.send(400, 'Invalid Request Signature');
  }

  User.findOne({
    email: profile.email
  }, function(err, existingUser) {
    if (existingUser) {
      var token = createJwtToken(existingUser);
      var tempy = {
        profile: existingUser.profile
      };
      return res.send({
        token: token,
        user: tempy
      });
    }
    var user = new User();

    user.email = profile.email;
    user.username = profile.name;
    user.save(function(err) {
      if (err) return next(err);
      else {
        var token = createJwtToken(user);
        var tempy = {
          profile: user.profile
        };
        res.send({
          token: token,
          user: tempy
        });
      }

    });
  });
};

exports.googleAuth = function(req, res) { //user model structure changed (slug, username moved out of profile)
  var profile = req.body.profile;
  User.findOne({
    email: profile.emails[0].value
  }, function(err, existingUser) {
    if (err) res.send(err);

    if (existingUser) {
      console.log('heere');
      var token = createJwtToken(existingUser);
      var tempy = {
        profile: existingUser.profile
      };
      return res.send({
        token: token,
        user: tempy
      });
    }
    var user = new User();
    user.profile.name = profile.displayName;
    user.email = profile.emails[0].value;
    user.save(function(err) {
      if (err) return next(err);
      else {
        var token = createJwtToken(user);
        var tempy = {
          profile: user.profile
        };
        res.send({
          token: token,
          user: tempy
        });
      }

    });
  });
};

exports.hasEmail = function(req, res, next) {
  console.log("hasEmail");
  if (!req.query.email) {
    return res.send(400, {
      message: 'Email parameter is required.'
    });
  }
  if (!validator.validate(req.query.email))
    return res.status(400).send(msg.inem);

  User.findOne({
    email: req.query.email
  }, function(err, user) {
    if (err) return next(err);
    console.log(user);
    res.send({
      available: !user
    });
  });
};

exports.getUser = function(req, res) {
  if (req.user.slug == req.params.uslug) {
    User.findById(req.user._id)
      .select('_id profile courses points slug username mobile email badges referalCode')
      .populate({
        path: 'badges._id'
      })
      .populate({
        path: 'courses._id',
        select: '_id slug name'
      })
      .exec(function(err, user) {
        if (err)
          res.status(400).send(err);
        else if (!user) {
          res.status(404).send(msg.unf);
        } else {
          console.log(user);
          var temp = user;
          if (user.badges.length)
            for (var i = 0; i < user.badges.length; i++) {
              temp.badges[i] = user.badges[i]._id;
            };
          console.log(temp)
          res.json(user);
        }
      });
  } else {
    res.status(404).send(msg.unauth);
  }
};

exports.getUserLog = function(req, res) {
  User.findOne({
    'profile.slug': req.params.uslug
  }, function(err, user) {
    if (err)
      res.status(400).send(err);
    else {
      res.json(complaint.log);
    }
  });
};

exports.changeUserPassword = function(req, res, next) {
  // console.log(req.body);
  User.findById(req.user._id, function(err, user) {
    if (err)
      res.status(400).send(err);
    else if (!user) {
      res.status(404).send(msg.unf);
    } else {
      user.comparePassword(req.body.oldPassword, function(err, isMatch) {
        if (err)
          res.status(400).send(err);
        else if (!isMatch) {
          res.status(401).send(msg.iop);
        } else {
          user.password = req.body.newPassword;
          user.save(function(err, user) {
            if (err)
              res.status(400).send(err);
            else {
              req.pass = true;
              req.to = user.email;
              req.subject = "Codegurukul Password Change";
              req.email = "Your Current Password for Codegurukul has been changed";
              next();
            }
          });
        }
      });
    }
  });
};

exports.updateProfile = function(req, res) {
  User.findById(req.user._id, function(err, user) {
    if (err) res.status(400).send(err);
    else if (!user) {
      res.status(404).send(msg.unf);
    } else {
      if (req.body.email && validator.validate(req.body.email))
        user.email = req.body.email;
      else return res.status(400).send(msg.inem);
      user.mobile = req.body.mobile;
      user.profile.fullname = req.body.fullname;
      user.profile.location = req.body.location;
      user.profile.gender = req.body.gender;
      user.profile.dob = req.body.dob;
      user.profile.type = req.body.type;
      user.profile.website = req.body.website;
      user.profile.facebook = req.body.facebook;
      user.profile.twitter = req.body.twitter;
      user.profile.google = req.body.google;
      user.profile.github = req.body.github;
      user.profile.instagram = req.body.instagram;
      user.profile.linkedin = req.body.linkedin;
      user.profile.organization = req.body.organization;
      user.profile.college = req.body.college;
      user.profile.stream = req.body.stream;
      user.profile.experience = req.body.experience;
      user.profile.workDesc = req.body.workDesc;
      user.profile.skills.splice(0, user.profile.skills.length);
      for (var i = 0; i <= req.body.skills.length - 1; i++) {
        user.profile.skills.push(req.body.skills[i].text);
      };
      user.save(function(err) {
        if (err) res.status(400).send(err);
        res.json({
          message: 'Profile updated'
        });
      });
    }


  });
};