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

// Username availability, not counting self.
exports.uniqueUsernameOnEdit = function(user, msg) {
    return function(form, field, callback) {
        User.findOne({username: field.data}, function(err, retrievedUser) {
            if (retrievedUser === null || retrievedUser.id == user.id) callback();
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

// Email availability, not counting self.
exports.uniqueEmailOnEdit = function(user, msg) {
    return function(form, field, callback) {
        User.findOne({email: field.data}, function(err, retrievedUser) {
            if (retrievedUser === null || retrievedUser.id == user.id) callback();
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
            if (user.authenticate(field.data)) callback();
            else callback(msg)
        });
    }
}
