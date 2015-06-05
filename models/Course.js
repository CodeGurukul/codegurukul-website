var mongoose = require('mongoose');
var User = require('./User');
// var Course = require('./Course');

var courseSchema = new mongoose.Schema({

  name:  { type: String,unique: true},
  description: String,
  shortDescription: String,
  thumb: String,
  slug: String,
  price: Number,
  tech: String,                  //cant use domain clashes with node
  duration: String,
  inviteOnly: Boolean,
  inviteMessage: String,
  status: {
    type: String,
    default: 'unpublished',
    enum: ['unpublished', 'new', 'closed', 'open']
  },
  slots: [{
      startDate: Date,
      city: String,
      batchSize: Number,
      location: String,
      attendees: [{
        _id : {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        completionDate: Date,
        status: {
          type: String,
          default: 'registered',
          enum: ['registered', 'cancelled', 'completed' ]
        }
      }],
      leads: [{
        _id : {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        creationDate: Date,
        status: {
          type: String,
          default: 'new',
          enum: ['new', 'cancelled', 'converted' ]
        }
      }]  
    }],
  mentors:[{
    name: String,
    description: String,
    image: String
  }],
  content:[{
    title: String,
    duration: String,
    difficulty: String,
    description: String
  }],
  testimonials:[{
    name: String,
    image: String,
    description: String
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


courseSchema.pre('save', function(next) {
  this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model('Course', courseSchema);