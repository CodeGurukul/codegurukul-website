var moment = require('moment');
var Code = require('../models/Code');

function generate_code () {
	console.log("generate_code");
	for (var i = 1; i < 26; i++) {
		var value = codeGen(5);
		var code = new Code({
			name:  "Web internship code" + i,
		  value: value,
		  discount: false,
		  discountValue: 0,
		  access: true,
		  courses: ["web-internship-program"]
		})
		code.save(function (err, code) {
			if (err) return console.log(err);
			console.log(i + ".  " + code.value);
		})

	};

}

function codeGen(len)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
generate_code();
