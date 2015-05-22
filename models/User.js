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
        }
    }],
    badges: [{
        _id : {type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }
    }],
    invoices: [{
        _id : {type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }
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
    points: Number

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



userSchema.pre('save', function(next) {
    var user = this;
    if (user.slug == null || user.slug == undefined) {
        user.slug = slugify(user.username + Math.floor((Math.random() * 100) + 1));
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