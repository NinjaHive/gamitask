// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    nick_name: String,
    coins: Number,
    experience: Number,
    mobile: String,
    address: String,
    active: Boolean,
    role: String
},
{ collection: "User" }
    );

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
