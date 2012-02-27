/*
 * User model.
 */

// Module dependencies.
var crypto = require('crypto');

// Schema definition.
var User = new Schema({
  username :      { type: String, required: true, unique: true },
  email :         { type: String, required: true, unique: true },
  admin :         { type: Boolean, default: false },
  superUser :     { type: Boolean, default: false },
  active :        { type: Boolean, default: false },
  hash :          String,
  salt :          String
});


/*
 * -----------------
 * Document methods.
 * -----------------
 */


/*
 * Get id.
 *
 * @return {String}: The id.
 */
User.virtual('id').get(function() {
  return this._id.toHexString();
});

/*
 * Generate salt and store encrypted password.
 *
 * @return void.
 */
User.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.generateSalt();
  this.hash = this.encryptPassword(password);
});

/*
 * Get encrypted password.
 *
 * @return {String}: The password.
 */
User.virtual('password').get(function() {
  return this._password;
});

/*
 * Generate salt.
 *
 * @return {String}: The salt.
 */
User.methods.generateSalt = function() {
  return Math.round((new Date().valueOf() + Math.random())) + '';
};

/*
 * Encrypt plaintext password.
 *
 * @param {String} password: The plaintext.
 *
 * @param {String}: The encrypted password.
 */
User.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).
    update(password).
    digest('hex');
};

/*
 * Check plaintext string against encrypted password.
 *
 * @param {String} plainText: The plaintext submission.
 *
 * @return {Boolean}: True the plaintext is the password.
 */
User.methods.authenticate = function(plainText) {
  return this.encryptPassword(plainText) === this.hash;
};


// Register model.
mongoose.model('User', User);
var User = mongoose.model('User');
