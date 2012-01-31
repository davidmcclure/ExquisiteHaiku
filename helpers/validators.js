/*
 * Custom form validators methods.
 */

// Models.
var User = mongoose.model('User');

// Username availability.
exports.uniqueUsername = function(msg) {
    return function(form, field, callback) {
        User.findOne({username: field.data}, function(err, doc) {
            if (doc === null) callback();
            else callback(msg);
        });
    }
}

// Email availability.
exports.uniqueEmail = function(msg) {
    return function(form, field, callback) {
        User.findOne({email: field.data}, function(err, doc) {
            if (doc === null) callback();
            else callback(msg);
        });
    }
}

// Username existence.
exports.usernameExists = function(msg) {
    return function(form, field, callback) {
        User.findOne({username: field.data}, function(err, doc) {
            if (doc === null) callback(msg);
            else callback();
        });
    }
}

// Password correctness.
exports.passwordCorrectness = function(msg) {
    return function(form, field, callback) {
        User.findOne({username: form.data.username}, function(err, doc) {
            if (doc.authenticate(field.data)) callback();
            else callback(msg);
        });
    }
}
