var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Course = require('./Course');
var Badge = require('./Badge');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    username: String,
    slug: String,
    verificationCode: String,
    verified: {
        type: Boolean,
        default: false
    },
    referalCode: String,            //Users own referal code.
    extReferalCode: String,         //Code of a user who refered this user.
    password: String,
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'staff', 'user']
    },
    courses: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        sid: mongoose.Schema.Types.ObjectId,
        joindate: Date,
        invoice: {type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }
    }],
    badges: [{
        _id : {type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }
    }],
    log: [{
        _id: false,
        entry: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    tokens: Array,

    profile: {
        joinDate: {
            type: Date,
            default: Date.now()
        },
        fullname: String,
        location: String,
        gender: {
            type: String,
            enum: ['male', 'female', 'other']
        },
        dob: Date,
        type: {
            type: String,
            enum: ['student', 'professional', 'other']
        },
        website: String,
        facebook: String,
        twitter: String,
        google: String,
        github: String,
        instagram: String,
        linkedin: String,
        organization: String,
        college: String,
        stream: String,
        year: Number,
        skills: [String],
        workDesc: String,
        experience: String
    },
    mobile: Number,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    points: {
      type: Number,
      default: 0
    }

});

//Slug function
function slugify(text) {
    console.log(text);
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};

function codeGen(len)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

userSchema.pre('save', function(next) {
    var user = this;
    if (user.slug == null || user.slug == undefined) {
        user.slug = slugify(user.username + Math.floor((Math.random() * 100) + 1));
    }
    if (this.isNew){
      this.verificationCode = codeGen(15);
      this.referalCode = codeGen(10);
    }
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(5, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);