/*
 * Custom form validators methods.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
var User = mongoose.model('User');


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
    }
}

/*
 * Check to see if a username is available, excluding the username of
 * the passed record. Used during user edit flow to allow an unchanged
 * username to be re-saved.
 *
 * - param object User: The user.
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.uniqueNonSelfUsername = function(user, msg) {
    return function(form, field, callback) {
        User.findOne({username: field.data}, function(err, retrievedUser) {
            if (retrievedUser === null || retrievedUser.id == user.id) callback();
            else callback(msg);
        });
    }
}

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
    }
}

/*
 * Check to see if an email address is available, excluding the email
 * of the passed record. Used during user edit flow to allow an unchanged
 * address to be re-saved.
 *
 * - param object User: The user.
 * - param string msg: The failure error message.
 *
 * - return void.
 */
exports.uniqueNonSelfEmail = function(user, msg) {
    return function(form, field, callback) {
        User.findOne({email: field.data}, function(err, retrievedUser) {
            if (retrievedUser === null || retrievedUser.id == user.id) callback();
            else callback(msg);
        });
    }
}

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
    }
}

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
    }
}

// Password correctness.
exports.passwordCorrectness = function(msg) {
    return function(form, field, callback) {
        User.findOne({username: form.data.username}, function(err, user) {
            if (user.authenticate(field.data)) callback();
            else callback(msg)
        });
    }
}
