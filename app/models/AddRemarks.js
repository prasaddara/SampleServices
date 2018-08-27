var mongoose = require('mongoose');
var AddRemarks = mongoose.Schema({
    mobile:String,
    itemdesc: String,
    remarks : String,
    assigndate: String
}, {
    timestamps: true
});
module.exports = mongoose.model('customer_remarks', AddRemarks);