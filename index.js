var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var passport = require('passport');
require('./config/passport.config.js')(passport);

var jwt = require('jsonwebtoken');

// create express app
var app = express();

var router = express.Router();

app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(passport.initialize());

// Configuring the database
var dbConfig = require('./config/database.config.js');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useMongoClient: true
});

mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
});

// define a simple katta
app.get('/', function(req, res){
    res.json({emailId : req.emailId,password : req.password});
});

    // Require katta routes
require('./app/routes/katta.routes.js')(app, passport);


// listen for requests
app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});
module.exports = router;
