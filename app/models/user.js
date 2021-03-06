
/**
 * User model.
 */

var crypto = require('crypto');
var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
  username : {
    type: String,
    required: true,
    unique: true
  },
  email : {
    type: String,
    required: true,
    unique: true
  },
  created : {
    type: Date,
    required: true,
    'default': Date.now
  },
  hash : {
    type: String
  },
  salt : {
    type: String
  }
});


/**
 * -------------------
 * Virtual attributes.
 * -------------------
 */


/**
 * Get id.
 *
 * @return {String}: The id.
 */
UserSchema.virtual('id').get(function() {
  return this._id.toHexString();
});


/**
 * Generate salt and store encrypted password.
 */
UserSchema.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.generateSalt();
  this.hash = this.encryptPassword(password);
});


/**
 * Get encrypted password.
 *
 * @return {String}: The password.
 */
UserSchema.virtual('password').get(function() {
  return this._password;
});


/**
 * -----------------
 * Document methods.
 * -----------------
 */


/**
 * Generate salt.
 *
 * @return {String}: The salt.
 */
UserSchema.methods.generateSalt = function() {
  return Math.round((new Date().valueOf() + Math.random())) + '';
};


/**
 * Encrypt plaintext password.
 *
 * @param {String} password: The plaintext.
 * @return {String}: The encrypted password.
 */
UserSchema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).
    update(password).
    digest('hex');
};


/**
 * Check plaintext string against encrypted password.
 *
 * @param {String} plainText: The plaintext submission.
 * @return {Boolean}: True the plaintext is the password.
 */
UserSchema.methods.authenticate = function(plainText) {
  return this.encryptPassword(plainText) === this.hash;
};


// Register model.
module.exports = mongoose.model('User', UserSchema);
