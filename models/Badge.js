var mongoose = require('mongoose');
var Course = require('./Course');
var Badge = require('./Badge');

var badgeSchema = new mongoose.Schema({

  name:  { type: String,unique: true},
  description: String,
  shortDescription: String,
  thumb: String,
  image: String,
  slug: String,
  courses: [{
    _id : {type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
  }],
  parents: [{
    _id : {type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }
  }],
  children: [{
    _id : {type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }
  }]
})

//Slug function
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};


badgeSchema.pre('save', function(next) {
  this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model('Badge', badgeSchema);