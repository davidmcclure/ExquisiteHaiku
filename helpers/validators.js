/*
 * Custom form validators methods.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
var User = mongoose.model('User');

// Username availability.
exports.uniqueUsername = function(msg) {
    return function(form, field, callback) {
        User.findOne({username: field.data}, function(err, user) {
            if (user === null) callback();
            else callback(msg);
        });
    }
}

// Email availability.
exports.uniqueEmail = function(msg) {
    return function(form, field, callback) {
        User.findOne({email: field.data}, function(err, user) {
            if (user === null) callback();
            else callback(msg);
        });
    }
}

// Username existence.
exports.usernameExists = function(msg) {
    return function(form, field, callback) {
        User.findOne({username: field.data}, function(err, user) {
            if (user === null) callback(msg);
            else callback();
        });
    }
}

// Username active.
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
            if (!_.isNull(user)) {
                if (user.authenticate(field.data)) callback();
            } else callback(msg);
        });
    }
}
