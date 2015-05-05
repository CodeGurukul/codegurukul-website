var jwt = require('jwt-simple');
var moment = require('moment');
var crypto = require('crypto');
var path = require('path');
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
        slug: user.slug
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

exports.signup = function(req, res, next) {
    if(!validator.validate(req.body.email))
        return res.status(400).send(msg.inem);
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username
    });
    user.save(function(err, user, numberAffected) {
        if (err) res.send(err);
        else {
            res.status(200).send(msg.signup);
        }

    });
};

exports.login = function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (!user) return res.status(401).send(msg.unf);
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) return res.status(401).send(msg.inep);
            var token = createJwtToken(user);
            var temp = {
                username: user.username,
                slug: user.slug
            };
            console.log(temp);
            res.send({
                token: token,
                user: temp
            });
        });
    });
};

exports.githubAuth = function(req, res) {
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

exports.linkedinAuth = function(req, res) {
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

exports.facebookAuth = function(req, res) {
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

exports.googleAuth = function(req, res) {
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
    if (!req.query.email) {
        return res.send(400, {
            message: 'Email parameter is required.'
        });
    }
    if(!validator.validate(req.body.email))
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
            .select('-_id profile courses points slug username phone email')
            .exec(function(err, user) {
            if (err)
                res.send(err);
            else if (!user) {
                res.status(404).send(msg.unf);
            } else {
                res.json(user);
            }
        });
    } else {
        res.status(401).send(msg.unauth);
    }
};

exports.getUserLog = function(req, res) {
    User.findOne({
        'profile.slug': req.params.uslug
    }, function(err, user) {
        if (err)
            res, send(err);
        else {
            res.json(complaint.log);
        }
    });
};

exports.changeUserPassword = function(req, res, next) {
    // console.log(req.body);
    User.findById(req.user._id, function(err, user) {
        if (err)
            res.send(err);
        else if (!user) {
            res.status(404).send(msg.unf);
        } else {
            user.comparePassword(req.body.oldPassword, function(err, isMatch) {
                if (err)
                    res.send(err);
                else if (!isMatch) {
                    res.status(401).send(msg.iop);
                } else {
                    user.password = req.body.newPassword;
                    user.save(function(err, user) {
                        if (err)
                            res.send(err);
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
        if (err) res.send(err);
        else if (!user) {
            res.status(404).send(msg.unf);
        } else {
            if(validator.validate(req.body.email))
                user.email = req.body.email;
            else return res.status(400).send(msg.inem);
            user.profile.fullname = req.body.fullname;
            user.profile.location = req.body.location;
            user.profile.gender = req.body.gender;
            user.profile.dob = req.body.dob;
            user.profile.website = req.body.website;
            user.profile.facebook = req.body.facebook;
            user.profile.twitter = req.body.twitter;
            user.profile.google = req.body.google;
            user.profile.github = req.body.github;
            user.profile.instagram = req.body.instagram;
            user.profile.linkedin = req.body.linkedin;
            user.profile.organization = req.body.organization;
            user.profile.experience = req.body.experience;
            user.profile.college = req.body.college;
            user.profile.branch = req.body.branch;
            //      if (req.body.skills)
            //        for (var i = 0; i <= req.body.skills.length - 1; i++) {
            //          user.profile.skills.push(req.body.skills[i].text);
            //        };
            user.profile.skills.splice(0, user.profile.skills.length);
            for (var i = 0; i <= req.body.skills.length - 1; i++) {
                user.profile.skills.push(req.body.skills[i].text);
            };
            user.profile.exp = req.body.exp;
            user.save(function(err) {
                if (err) res.send(err);
                res.json({
                    message: 'Profile updated'
                });
            });
        }

        console.log(user);
    });
};