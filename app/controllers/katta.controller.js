var Kattakart = require('../models/katta.model.js');
var User = require('../models/login.js');
var NewCustomer = require('../models/AddCustomer.js');
var CustomerRemarks = require('../models/AddRemarks.js');
var assert = require('assert');

exports.create = function(req, res) {
    // Create and Save a new Note
    // Create and Save a new Note
    console.log(req.body.content);
    if (!req.body.content) {
        return res.status(400).send({message: "katta can not be empty"});
    }
    var katta = new Kattakart({
        loginId: req.body.loginId || "Untitled katta",
        password: req.body.password,
        emailId: req.body.emailId,
        address: req.body.address,
        contactnumber: req.body.contactnumber,
        station: req.body.station,
        status: req.body.status
    });
    katta.save(function (err, data) {
        if (err) {

            console.log(err);
            res.json({response_code:1, message: "Customer with this mobile number already exists"});
        } else {
            res.json({response_code:0, message: "success", result_object:data});
        }
    });
};
exports.login = function(req, res) {
    var emailId = req.body.emailId;
    var password = req.body.password;
    if (emailId.length > 0 && password.length > 0) {
        Kattakart.findOne({emailId: emailId, password: password}, function (err, user) {
            if (err) {
                console.log("error");
                res.json({response_code: 1, message: err});
            }
            if (!user) {
                console.log("fail");
                res.json({response_code: 1, msg: "not found"});
            }else {
                console.log("sucess");
                res.json({response_code: 0, id: user._id, message: "success"});
            }
        })
    } else {
        res.json({response_code: 1, msg: "Invalid Fields"});
    }
};
exports.createCustomer = function(req, res) {
    var customer = new NewCustomer({
        mobile: req.body.mobile,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        assigndate: req.body.assigndate,
        remarks:  []
    });
    NewCustomer.findOne({mobile: req.body.mobile}).then(function(record){
        console.log("success: "+ record);
        if(record == null){
            console.log("1 st record count: "+ record);
            customer.save().then(function () {
                console.log( "ITEM desc:  "+req.body.mobile);
                NewCustomer.findOne({mobile: req.body.mobile}).then(function(record){
                    record.remarks.push({itemdesc: req.body.remarks[0].itemdesc,remark: req.body.remarks[0].remark});
                    console.log("Sucess");
                    record.save().then(function(err){
                        console.log("Sucess1");
                    });
                });
            });
        }else{
            record.remarks.push({itemdesc: req.body.remarks[0].itemdesc,remark: req.body.remarks[0].remark});
            console.log("Sucess");
            record.save().then(function(data,err){
                if (data) {
                    res.json({response_code: 0, message: "success", result_object: data});
                } else {
                    res.json({response_code: 1, message: "Customer with this mobile number already exists"});
                }
                console.log("Sucess1");
            });
        }
    })
};
exports.createRemarks = function(req, res) {
    // Create and Save a new Note
    // Create and Save a new Note
    var remarks = new CustomerRemarks({
        mobile: req.body.mobile,
        itemdesc: req.body.itemdesc,
        remarks: req.body.remarks,
        assigndate: req.body.assigndate
    });
    remarks.save(function (err, data) {
        if (err) {
            console.log(err);
            res.json({response_code:1, message: "Cannot Add Remarks"});
        } else {
            res.json({response_code:0, message: "success",  Remarks:data});
        }
    });
};
exports.findAll = function(req, res) {
    // Retrieve and return all notes from the database.
    NewCustomer.find().then(function(customer) {
        res.json({response_code:0, message: "success",  result_object:customer}).catch(err)
        res.json({response_code:1, message: err.message || "Cannot get customers"});
    });
};
exports.getOneList = function(req, res) {
    var mobile = req.body.mobile;
    if (mobile.length > 0) {
        NewCustomer.findOne({mobile: mobile}, function (err, cust) {
            if (err) {
                console.log("error");
                res.json({response_code: 1, message: err});
            }
            if (!cust) {
                console.log("fail");
                res.json({response_code: 1,msg: "Cannot get customer details, please check phone number you have entered"});
            }
            else {
                res.json({response_code: 0, message: "success", result_object: cust});
            }
        });
    }
    else {
        res.json({response_code: 1, msg: "Invalid Fields"});
    }
};
exports.update =  function(req, res) {
    var mobile= req.params.mobile;
    NewCustomer.findOne({mobile:mobile}, function(err,foundObject){
        if(err){
            console.log(err);
            res.json({response_code: 1, message: err});
        }
        else{
            if(!foundObject){
                res.json({response_code: 1, message: "Customer not found with this number "});
            }else{
                if(req.body.mobile){
                    foundObject.mobile=req.body.mobile;
                }
                if(req.body.name){
                    foundObject.name=req.body.name;
                }
                if(req.body.email){
                    foundObject.email=req.body.email;
                }
                if(req.body.address){
                    foundObject.address=req.body.address;
                }
                if(req.body.itemdesc){
                    foundObject.itemdesc=req.body.itemdesc;
                }
                if(req.body.assigndate){
                    foundObject.assigndate=req.body.assigndate;
                }
                foundObject.save(function(err, updatedObject){

                    if(err){
                        console.log(err);
                        res.json({response_code: 1, message: err});
                    }else{
                        res.json({response_code: 0, message: "customer details updated successfully", result_object: updatedObject});
                    }

                });
            }
        }

    });
};
exports.delete = function(req, res) {
    NewCustomer.findByIdAndRemove(req.params.customerId, function(err, customer) {
        if(err) {
            console.log(err);
            if(err.kind === 'ObjectId') {
                res.json({response_code: 1, message: "Customer not found with id " + req.params.customerId});
            }
            else {
                res.json({response_code: 1, message: "Could not deleteCustomer with id " + req.params.customerId});
            }
        }
        if(!customer) {
            res.json({response_code: 1, message: "Customer not found with id " + req.params.customerId});
        }
        else {
            res.json({response_code: 0, msg: "Customer deleted successfully!"});
        }

    });
}