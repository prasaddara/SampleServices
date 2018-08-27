var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Login = new mongoose.Schema({
    emailId: String,
    password: String
}, {
    timestamps: true
});


Login.pre('get', function (next) {
    console.log("LoginController");
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

Login.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {

        console.log("LoginController");
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


