var mongoose = require('mongoose');
var User = require('./User');
var Counter = require('./Counter');
var invoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: Number
  },
  created: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['created', 'authorized', 'captured', 'paid']
  },
  net: {
    type: Number                       //not used
  },
  vat: {                              //not used
    type: Number
  },
  total: {
    type: Number
  },
  mop: String,
  paymentId: {type: String},          //razor pay ID
  products: [{
    product: {                        //course name
      type: String,
      default: '',
      trim: true
    },
    slug: {                           //course slug
      type: String,
      default: '',
      trim: true
    },
    date: {
      type: Date
    },
    quantity: {
      type: Number,
      default: 1
    },
    unitCost: {
      type: Number
    },
    vat: {                            //not used
      type: Number
    },
    total: {
      type: Number
    }
  }],
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

invoiceSchema.pre('save', function (done) {
  if (this.isNew){ //new Record => create
    //this function is the one that should do the FindAndModify stuff
    temp = this;
    getNewId(function(autoincremented_id){
      temp.invoiceId = autoincremented_id;
      done();
    })
  } else done();
});

invoiceSchema.virtual('invoiceNo').get(function () {
  return ("C" + ("0000000"+this.invoiceId).slice(-6));
});
invoiceSchema.virtual('invoiceNo').set(function (arg_id) {
  this.invoiceId = parseInt(arg_id);
});

function getNewId (callback) {
  Counter.increment('invoice', function (err, result) {
    if (err) {
      console.error('Counter on invoice save error: ' + err); return;
    };
    callback(result.seq);
  });
}

module.exports = mongoose.model('Invoice', invoiceSchema);
