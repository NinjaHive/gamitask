// =======================
// get the packages we need ============
// =======================
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var base64 = require('base-64');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
// get our mongoose models
var User = require('./models/user');
var authenticateService = require('./services/authenticate');

mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function (callback) {
    console.log("Connection Success");
});
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

//mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable
/*
MongoClient.connect("mongodb://heroku_0nnqckfc:9g0lk5tnvdemqgpj5hmvf6nsub@ds033153.mongolab.com:33153/heroku_0nnqckfc", function (err, db) {
    if (!err) {
        DB = db;
        console.log("We are connected");
    }
    else
        console.log("Error in connecting to DB")
});
*/
app.use(allowCrossDomain);
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/users', function (req, res) {
    authenticateService.getUsers().then(
        function (data) {
            res.json({
                errorCode: 0,
                errorMessage: "",
                data: data
            });
        }, function (err) {
            res.json({
                errorCode: 1,
                errorMessage: err.message,
                data: null
            });
        });
});
app.post('/register', function (req, res) {
    authenticateService.createUser(req.body).then(
        function (data) {
            var token = jwt.sign("Basic " + base64.encode(new Buffer(data.email + ':' + data.password)), app.get('superSecret'), {
                expiresInMinutes: 1440 // expires in 24 hours
            });
            res.json({
                errorCode: 0,
                errorMessage: "",
                data: {
                    user: data,
                    token:token
                }
            });
        },
        function (err) {
            res.json({
                errorCode: 1,
                errorMessage: err.message,
                data: null
            });
        }
        );

})
app.post('/login', function (req, res) {

    authenticateService.getUserByEmail(req.body.email, req.body.password).then(
        function (data) {
            if (data)
                res.json({
                    errorCode: 0,
                    errorMessage: "",
                    data: data
                });
            else
                res.json({
                    errorCode: 1,
                    errorMessage: "Invalid Username / Password",
                    data: null
                });
        },
        function (err) {
            res.json({
                errorCode: 1,
                errorMessage: err.message,
                data: null
            });
        }
        );
});
//Create Missions
app.post('/create-mission', function (req, res) {
    DB.collection('Mission', function (err, collection) {
        collection.insert({
            name: req.body.mission.name,
            description: req.body.mission.description,
            start_date_estimated: req.body.mission.start_date,
            end_date_estimated: req.body.mission.end_date,
            status: req.body.mission.status,
            award_coins: req.body.mission.award_coins,
            award_experience: req.body.mission.award_experience
        });

        res.json({
            errorCode: 0,
            errorMessage: "",
            data: {
                message: 'Mission Created Successfully'
            }
        });

    })
})
app.post('/missions', function (req, res) {

    DB.collection('Mission', function (err, collection) {
        collection.find({}).toArray(function (err, missions) {
            res.json({
                errorCode: 0,
                errorMessage: "",
                data: {
                    missions: missions
                }
            });
        });
    });
});
app.post('/delete-mission', function (req, res) {

    DB.collection('Mission', function (err, collection) {

        collection.remove({ _id: new mongodb.ObjectID(req.body.mission_id) });
        res.json({
            errorCode: 0,
            errorMessage: "",
            data: {
                missions: req.body.mission_id
            }
        });
    });
});
// API ROUTES -------------------
// we'll get to these in a second

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);