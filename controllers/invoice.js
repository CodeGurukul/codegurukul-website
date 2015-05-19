var Code = require('../models/Code');
var User = require('../models/User');
var Invoice = require('../models/Invoice');
var email = require('../controllers/email');

exports.generate = function(req, res, next) {
  if (req.pay) {
    console.log('new invoice');
    var invoice = new Invoice({
      status: req.status,
      total: req.coursePrice,
      user: req.userId,
      paymentId: req.body.payment_id
    });
    invoice.products.push({
      product: req.course,
      slug: req.courseSlug,
      date: req.courseDate,
      unitCost: req.coursePrice,
      total: req.coursePrice
    });
    invoice.save(function (err, newInvoice, numberAffected) {
      if (err) res.status(400).send(err);
      else {
        var emailData = {
          to: req.to,
          userName: req.name
        };
        email.sendInvoice(newInvoice, emailData);
        User.findById(req.user._id, function(err, user) {
          if (err) res.send(err);
          else if (!user) res.status(404).send('User not found.');
          else {
            user.invoices.push({
              _id: newInvoice._id
            });
            user.save(function(err) {
              if (err) res.send(err);
              else {
                res.json({ message: 'Payment success'});
              }
            })
          }
        })
      }
    })
  };
};


// exports.assign = validateCode;
















