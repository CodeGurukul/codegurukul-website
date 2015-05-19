var mongoose = require('mongoose');
var User = require('./User');
var invoiceSchema = new mongoose.Schema({
/*  invoiceId: {
    type: Number
  },
*/ 
  created: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['created', 'authorized', 'captured']
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

// invoiceSchema.pre('save', function (done) {
//   if (this.isNew){ //new Record => create
//     //this function is the one that should do the FindAndModify stuff
//     getNewId(function(autoincremented_id){
//       this.id=autoincremented_id;
//       done()
//     })
//   }else{
//     done()
//   }
// });

// invoiceSchema.virtual('formattedId').get(function () {
//   return ("0000000"+this.id).slice(-7);
// });
// invoiceSchema.virtual('formattedId').set(function (arg_id) {
//   this.id = parseInt(arg_id);
// });

module.exports = mongoose.model('Invoice', invoiceSchema);
