var mongoose = require('mongoose');
var Course = require('./Course');

var codeSchema = new mongoose.Schema({

  name:  { type: String,unique: true},
  value: { type: String,unique: true},
  discount: Boolean,
  discountValue: Number,
  access: Boolean,
  courses: [{
    _id : {type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
  }]
})

module.exports = mongoose.model('Code', codeSchema);