var mongoose = require('mongoose');
var Course = require('./Course');

var codeSchema = new mongoose.Schema({

  name:  { type: String,unique: true},
  value: { type: String,unique: true},
  discount: Boolean,
  discountValue: Number,
  access: Boolean,
  courses: [String]
})

module.exports = mongoose.model('Code', codeSchema);