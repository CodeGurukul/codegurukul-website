var request = require('request');

exports.verifyPay = function(req,res,next){
	// console.log(req.body);
	var url = 'https://rzp_test_RYIGbvgxqTBJha:KDGk0KgIOjuJeMArLcuvSUbB@api.razorpay.com/v1/payments/'+req.body.payment_id;
	request(url, function (error, response, body) {
		if(error)
			res.status(412).send(error);
		else{
			// console.log('Response:', JSON.parse(body));
			var data = JSON.parse(body);
			if(data.id == req.body.payment_id){
				console.log('done');
				res.end();
			}
			else{
				res.status(412).send('Id didnt Match');
			}
		}

	});
};
