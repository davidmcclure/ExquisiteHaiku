/*
 * User model.
 */

// Module dependencies.
var crypto = require('crypto');

// Schema definition.
var User = new Schema({
    username :          { type: String, unique: true },
    hash :              String,
    salt :              String,
    email :             { type: String, unique: true },
    super :             Boolean
});

// Id getter.
User.virtual('id').get(function() {
    return this._id.toHexString();
});

// Password setter and getter.
User.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.generateSalt();
    this.hash = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

// Check password.
User.methods.authenticate = function(plainText) {
    return this.encryptPassword(plainText) === this.hash;
};

// Create salt.
User.methods.generateSalt = function() {
    return Math.round((new Date().valueOf() + Math.random())) + '';
};

// Encrypt password.
User.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).
      update(password).
      digest('hex');
};

mongoose.model('User', User)
