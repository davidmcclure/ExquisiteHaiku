/*
 * User model.
 */

// Module dependencies.
var crypto = require('crypto');

// Schema definition.
var User = new Schema({
  username :          { type: String, unique: true },
  email :             { type: String, unique: true },
  superUser :         { type: Boolean, default: false },
  active :            { type: Boolean, default: false },
  hash :              String,
  salt :              String
});


/*
 * -----------------
 * Document methods.
 * -----------------
 */

/*
 * Get id.
 *
 * @return string: The id.
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
 * @return string: The password.
 */
User.virtual('password').get(function() {
  return this._password;
});

/*
 * Check plaintext string against encrypted password.
 *
 * @param string plainText: The plaintext submission.
 *
 * @return boolean: True the plaintext is the password.
 */
User.methods.authenticate = function(plainText) {
  return this.encryptPassword(plainText) === this.hash;
};

/*
 * Generate salt.
 *
 * @return string: The salt.
 */
User.methods.generateSalt = function() {
  return Math.round((new Date().valueOf() + Math.random())) + '';
};

/*
 * Encrypt plaintext password.
 *
 * @param string password: The plaintext.
 *
 * @param string: The encrypted password.
 */
User.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).
    update(password).
    digest('hex');
};


// Register model.
mongoose.model('User', User);
var User = mongoose.model('User');
