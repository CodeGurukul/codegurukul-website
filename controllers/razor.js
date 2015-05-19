var request = require('request');
var secret = require('../config/secrets');
var User = require('../models/User');
var code = require('../controllers/code');
var config = new secret();

var auth = config.razorpay.id + ':' + config.razorpay.secret;

exports.verifyPay = function(req,res,next){
	console.log("verifyPay");
	code.validate(req.body.code, req.body.cslug, function(result) {
		if (result.status != 200) return res.status(result.status).send(result.value);;
    if (result.value>0) {
	    var url = 'https://'+auth+'@api.razorpay.com/v1/payments/'+req.body.payment_id;
			request(url, function (error, response, body) {
				if(error) res.status(412).send(error);
				else{
					// console.log('Response:', JSON.parse(body));
					var data = JSON.parse(body);
					// console.log(data);
					if (data.status == "failed") return res.status(400).send("There was an error with your transaction");
					if (data.amount/100 != result.value) return res.status(400).send("Incorrect amount paid.");
					else {
						if(data.id == req.body.payment_id){
							req.status = data.status;
							req.pay = true;
							req.coursePrice = result.value;
							next();
						}
						else{
							res.status(412).send('Id didnt Match');
						}
					}
				}

			});
		} else{
			req.pay = false;
			next();
		}
  })
	
};
