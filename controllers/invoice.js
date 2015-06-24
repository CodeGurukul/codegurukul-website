var Code = require('../models/Code');
var User = require('../models/User');
var Invoice = require('../models/Invoice');
var email = require('../controllers/email');
var secret = require('../config/secrets');
var moment = require('moment');
var config = new secret();

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.mandrill.password);

var fs = require('fs');
var pdf = require('html-pdf');

exports.generate = function(req, res, next) {
  if (req.pay) {
      
      if (!req.invoiceId) {
        console.log('new invoice');
        if (req.status == "paid") 
          var bal = 0;
        else bal = req.coursePrice;

        var invoice = new Invoice({
          status: req.status,
          total: req.coursePrice,
          balance: bal,
          user: req.userId,
          paymentId: req.body.payment_id,
          mop: req.mop
        });
        invoice.products.push({
          product: req.course,
          slug: req.courseSlug,
          date: req.courseDate,
          unitCost: req.coursePrice,
          total: req.coursePrice
        });
        saveInvoice(req, res, invoice);
      } else{
        console.log('EXISTING invoice');
        Invoice.findById(req.invoiceId, function (err, invoice) {
          if (err) return res.status(400).send(err);
          else if (!invoice) return res.status(400).send("Invoice does not exist");
          else {
            if (req.status == "paid") 
              var bal = 0;
            else bal = req.coursePrice;
            invoice.status = req.status;
            invoice.total = req.coursePrice;
            invoice.paymentId = req.body.payment_id;
            invoice.balance = bal;
            invoice.mop = req.mop;
            invoice.products[0].unitCost = req.coursePrice;
            invoice.products[0].total = req.coursePrice;
            saveInvoice(req, res, invoice);
          }
        })
      }

  };
};
var saveInvoice = function (req, res, invoice) {
  invoice.save(function (err, newInvoice, numberAffected) {
    if (err) res.status(400).send(err);
    else {
      var emailData = {
        to: req.to,
        userName: req.name
      };
      email.sendInvoice(newInvoice, emailData);
      User.findById(req.userId, function(err, user) {
        if (err) res.send(err);
        else if (!user) res.status(404).send('User not found');
        else {
          console.log(user);
          user.courses.id(req.courseId).invoice = newInvoice._id,
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
}


exports.pdf = function (req, res) {
  if (req.body.cid && req.body.invoice) {
    
    User.findById(req.user._id, function(err, user) {
      if (err) res.send(err);
      else if (!user) res.status(404).send('User not found');
      else if (!user.courses.id(req.body.cid)) return res.status(400).send('Course not joined');
      else if (user.courses.id(req.body.cid).invoice != req.body.invoice) return res.status(400).send('Invalid invoice');
      else {
        //check if invoice exists
        fs.lstat("public/temp/invoice/" + req.body.invoice + ".pdf", function(err, stats) {
          if (!err && stats.isFile()) {
           res.status(200).send("temp/invoice/" + req.body.invoice + ".pdf");
          } else { 
            //if no
            Invoice.findById(req.body.invoice, function (err, invoice) {
              if (err) return res.status(400).send(err);
              else if (!invoice) res.status(400).send("Invalid invoice");
              else {
                var template_name = "invoice_template";
                var template_content = [];
                var merge_vars = [{
                  "name": "invNumber",
                  "content": invoice.invoiceNo
                }, {
                  "name": "invDate",
                  "content": moment(invoice.created).format("MMM DD, YYYY")
                }, {
                  "name": "courseName",
                  "content": invoice.products[0].product
                }, {
                  "name": "coursePrice",
                  "content": invoice.products[0].total
                }, {
                  "name": "courseDate",
                  "content": moment(invoice.products[0].date).format("MMM DD, YYYY")
                }, {
                  "name": "name",
                  "content": user.profile.fullname
                }, {
                  "name": "email",
                  "content": user.email
                }, {
                  "name": "mop",
                  "content": invoice.mop
                }];
                var async = false;
                mandrill_client.templates.render({
                  "template_name": template_name,
                  "template_content": template_content,
                  "merge_vars": merge_vars
                }, function(result) {
                  var html = result.html;
                  var options = { filename: "public/temp/invoice/" + req.body.invoice + ".pdf", format: "Letter" };
                  pdf.create(html, options).toFile(function(err, pdfRes) {
                    if (err) return console.log(err);
                    console.log(pdfRes); // { filename: '/tmp/html-pdf-8ymPV.pdf' } 
                    res.status(200).send("temp/invoice/" + req.body.invoice + ".pdf");
                  });
                  return;
                }, function(e) {
                  // Mandrill returns the error as an object with name and message keys
                  res.status(400).send("An error occured");
                  console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                  // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
                });
              }
            })
          }
        });
      }
    })

  } else res.status(400).send("Course and invoice ID required");
}















