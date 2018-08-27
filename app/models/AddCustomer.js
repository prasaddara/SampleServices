var mongoose = require('mongoose');


var RemarksSchema = mongoose.Schema({
   itemdesc : String,
    remark : String
});

var AddCustomer = mongoose.Schema({
    mobile:String,
    name:String,
    email: String,
    address: String,
    assigndate: String,
    remarks : [RemarksSchema]
}, {
    timestamps: true
});
module.exports = mongoose.model('add_customer', AddCustomer);
