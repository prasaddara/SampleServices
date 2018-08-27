var mongoose = require('mongoose');

var LoginSchema = mongoose.Schema({
   title:String,
   content:String,
    loginId: String,
    password: String,
    emailId: String,
	address: String,
    contactnumber: {type: String , unique : true},
    station : String,
    status: String
}, {
    timestamps: true
});

module.exports = mongoose.model('customer_login', LoginSchema);


