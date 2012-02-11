/*
 * Administrator model.
 */

// Module dependencies.
var crypto = require('crypto');

// Schema definition.
var Admin = new Schema({
    username :          { type: String, unique: true },
    hash :              String,
    salt :              String,
    email :             { type: String, unique: true },
    superUser :         Boolean,
    active :            Boolean
});

// Register model.
mongoose.model('Admin', Admin);


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
Admin.virtual('id').get(function() {
    return this._id.toHexString();
});

/*
 * Generate salt and store encrypted password.
 *
 * @return void.
 */
Admin.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.generateSalt();
    this.hash = this.encryptPassword(password);
});

/*
 * Get encrypted password.
 *
 * @return string: The password.
 */
Admin.virtual('password').get(function() {
    return this._password;
});

/*
 * Check plaintext string against encrypted password.
 *
 * @param string plainText: The plaintext submission.
 *
 * @return boolean: True the plaintext is the password.
 */
Admin.methods.authenticate = function(plainText) {
    return this.encryptPassword(plainText) === this.hash;
};

/*
 * Generate salt.
 *
 * @return string: The salt.
 */
Admin.methods.generateSalt = function() {
    return Math.round((new Date().valueOf() + Math.random())) + '';
};

/*
 * Encrypt plaintext password.
 *
 * @param string password: The plaintext.
 *
 * @param string: The encrypted password.
 */
Admin.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).
      update(password).
      digest('hex');
};
