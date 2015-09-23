var $q = require('q')
var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var base64 = require('base-64');

module.exports = {
    getUsers: function () {
        var defered = $q.defer();
        var query = User.find({}).where('role').equals('User').sort('first_name').select('_id first_name last_name nick_name');
        query.exec(function (err, users) {
            if (err)
                defered.reject(err);
            else
                defered.resolve(users);
        });
        return defered.promise;
    },
    getUserByEmail: function (email, password) {
        var defered = $q.defer();
      
        var query = User.findOne({ email: email, password: password });
        query.select('_id first_name last_name email nick_name');
        query.exec(function (err, user) {
            if (err)
                defered.reject(err);
            else
                defered.resolve(user);
        });
        return defered.promise;
    },

    createUser: function (user) {
        var defered = $q.defer();

        var newUser = User({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            nick_name: user.nick_name,
            coins: 0,
            experience: 0,
            mobile: user.mobile,
            address: user.address,
            active: true,
            role: "User"
        });

        newUser.save(function (err, user) {
            if (err)
                defered.reject(err);
            else {
               
                var minifiedUser = {};
                minifiedUser.first_name = user.first_name;
                minifiedUser.last_name = user.last_name;
                minifiedUser.id = user._id;
                // return the information including token as JSON
                defered.resolve(
                  minifiedUser
                );
            }
        });
        return defered.promise;
    }
};