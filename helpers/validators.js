/*
 * Custom form validators methods.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');


/*
 * -----------------------
 * Custom form validators.
 * -----------------------
 */


/*
 * Pass if user exists with username.
 *
 * @param {String} msg: The failure message.
 *
 * @return void.
 */
exports.usernameExists = function (msg) {
  return function(form, field, callback) {
    User.findOne({ username: field.data }, function(err, user) {
      if (_.isNull(user)) callback(msg);
      else callback();
    });
  };
};


/*
 * Pass if field is not in blacklist.
 *
 * @param {Array} blacklist: The list of prohibited usernames.
 * @param {String} msg: The failure message.
 *
 * @return void.
 */
exports.fieldAllowed = function (blacklist, msg) {
  return function(form, field, callback) {
    if (_.include(blacklist, field.data)) callback(msg);
    else callback();
  };
};


/*
 * Pass if the password is correct.
 *
 * @param {String} msg: The failure message.
 *
 * @return void.
 */
exports.passwordCorrect = function (msg) {
  return function(form, field, callback) {
    User.findOne({ username: form.data.username }, function(err, user) {
      if (user && user.authenticate(field.data)) callback();
      else callback(msg);
    });
  };
};

/*
 * Pass if there is not already a document in the collection that
 * has the form value in the {column} field.
 *
 * @param {Model} coll: The collection.
 * @param {String} column: The name of the field.
 * @param {String} msg: The failure message.
 *
 * @return void.
 */
exports.uniqueField = function (coll, column, msg) {
  return function(form, field, callback) {
    coll.findOne().where(column, field.data).exec(function(err, doc) {
      if (_.isNull(doc)) callback();
      else callback(msg);
    });
  };
};

/*
 * Pass if there is not already a document in the collection that
 * has the form value in the {column} field, excluding the {self}
 * document. Used for edit forms to allow unchanged unique parameters.
 *
 * @param {Model} coll: The collection.
 * @param {String} column: The name of the field.
 * @param {Document} self: The document to exclude.
 * @param {String} msg: The failure message.
 *
 * @return void.
 */
exports.uniqueNonSelfField = function (coll, column, self, msg) {
  return function(form, field, callback) {
    coll.findOne().where(column, field.data).exec(function(err, doc) {
      if (_.isNull(doc) || doc.id === self.id) callback();
      else callback(msg);
    });
  };
};

/*
 * Pass if the field data is a valid poem url slug.
 *
 * @param {String} msg: The failure message.
 *
 * @return void.
 */
exports.validSlug = function (msg) {
  return function(form, field, callback) {
    if (field.data.match(/^[a-z0-9_\-]+$/)) callback();
    else callback(msg);
  };
};

/*
 * Check to see a value is a positive integer.
 *
 * @param string msg: The failure error message.
 *
 * @return void.
 */
exports.positiveInteger = function(msg) {
  return function(form, field, callback) {
    if ((parseFloat(field.data) == parseInt(field.data, 10)) &&
      !isNaN(field.data) && parseInt(field.data, 10) >= 0) {
        callback();
    } else callback(msg);
  };
};
