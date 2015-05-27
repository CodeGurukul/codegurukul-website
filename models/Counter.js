var mongoose = require('mongoose');

var counterSchema = new mongoose.Schema({
  _id: String,
  seq: {type: Number, default: 1}
})


// counterSchema.pre('save', function(next) {
//   this.slug = slugify(this.name);
//   next();
// });
counterSchema.statics.increment = function (counter, callback) {
    return this.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, {new: true, upsert: true, select: {seq: 1}}, callback);
};

module.exports = mongoose.model('Counter', counterSchema);