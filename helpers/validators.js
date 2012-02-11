/*
 * Custom form validators methods.
 */

// Module dependencies.
var _ = require('underscore'),
    states = require('../app/models/_states').states;

// Models.
var User = mongoose.model('User');
var College = mongoose.model('College');


/*
 * Check to see if a username is available.
 *
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.uniqueUsername = function(msg) {
    return function(form, field, callback) {
        User.findOne({username: field.data}, function(err, user) {
            if (user === null) callback();
            else callback(msg);
        });
    };
};


/*
 * Check to see if a username is available, excluding the username of
 * the passed record.
 *
 * - param object User: The user.
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.uniqueNonSelfUsername = function(user, msg) {
    return function(form, field, callback) {
        User.findOne({username: field.data}, function(err, foundUser) {
            if (foundUser === null || foundUser.id == user.id) callback();
            else callback(msg);
        });
    };
};


/*
 * Check to see if an email address is available.
 *
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.uniqueEmail = function(msg) {
    return function(form, field, callback) {
        User.findOne({email: field.data}, function(err, user) {
            if (user === null) callback();
            else callback(msg);
        });
    };
};


/*
 * Check to see if an email address is available, excluding the email
 * of the passed record.
 *
 * - param object User: The user.
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.uniqueNonSelfEmail = function(user, msg) {
    return function(form, field, callback) {
        User.findOne({email: field.data}, function(err, foundUser) {
            if (foundUser === null || foundUser.id == user.id) callback();
            else callback(msg);
        });
    };
};


/*
 * Check to see a user with a given username exists.
 *
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.usernameExists = function(msg) {
    return function(form, field, callback) {
        User.findOne({username: field.data}, function(err, user) {
            if (user === null) callback(msg);
            else callback();
        });
    };
};


/*
 * Check to see a user with a given username is active.
 *
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.usernameActive = function(msg) {
    return function(form, field, callback) {
        User.findOne({username: field.data}, function(err, user) {
            if (user !== null && !user.active) callback(msg);
            else callback();
        });
    };
};


/*
 * Check for password correctness
 *
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.passwordCorrectness = function(msg) {
    return function(form, field, callback) {
        User.findOne({username: form.data.username}, function(err, user) {
            if (user.authenticate(field.data)) callback();
            else callback(msg);
        });
    };
};


/*
 * Check to see if a college name is available, excluding the name
 * of the passed college.
 *
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.uniqueNonSelfCollegeName = function(college, msg) {
    return function(form, field, callback) {
        College.findOne(
            { name: { $regex: new RegExp(field.data, 'i') } },
            function(err, foundCollege) {
                if (foundCollege === null || foundCollege.id == college.id) callback();
                else callback(msg);
        });
    };
};


/*
 * Check to see if a college slug is available, excluding the slug of
 * the passed college.
 *
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.uniqueNonSelfCollegeSlug = function(college, msg) {
    return function(form, field, callback) {
        College.findOne(
            { slug: { $regex: new RegExp(field.data, 'i') } },
            function(err, foundCollege) {
                if (foundCollege === null || foundCollege.id == college.id) callback();
                else callback(msg);
        });
    };
};


/*
 * Check to see a state abbreviation is valid.
 *
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.validState = function(msg) {
    return function(form, field, callback) {
        if (_.include(states, field.data.toUpperCase())) callback();
        else callback(msg);
    };
};


/*
 * Check to see a value is positive.
 *
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.positive = function(msg) {
    return function(form, field, callback) {
        if (field.data >= 0) callback();
        else callback(msg);
    };
};


/*
 * Check to see a value is a positive integer.
 *
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.positiveInteger = function(msg) {
    return function(form, field, callback) {
        if ((parseFloat(field.data) == parseInt(field.data, 10)) &&
            !isNaN(field.data) && parseInt(field.data, 10) >= 0) {
                callback();
        } else callback(msg);
    };
};
