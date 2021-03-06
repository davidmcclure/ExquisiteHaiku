
/**
 * Custom form validators methods.
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');


/**
 * Pass if user exists with username.
 *
 * @param {String} msg: The failure message.
 */
exports.usernameExists = function (msg) {
  return function(form, field, callback) {
    User.findOne({ username: field.data }, function(err, user) {
      if (_.isNull(user)) callback(msg);
      else callback();
    });
  };
};


/**
 * Pass if field is not in blacklist.
 *
 * @param {Array} blacklist: The list of prohibited usernames.
 * @param {String} msg: The failure message.
 */
exports.fieldAllowed = function (blacklist, msg) {
  return function(form, field, callback) {
    if (_.include(blacklist, field.data)) callback(msg);
    else callback();
  };
};


/**
 * Pass if the password is correct.
 *
 * @param {String} msg: The failure message.
 */
exports.passwordCorrect = function (msg) {
  return function(form, field, callback) {
    User.findOne({ username: form.data.username }, function(err, user) {
      if (user && user.authenticate(field.data)) callback();
      else callback(msg);
    });
  };
};


/**
 * Pass if there is not already a document in the collection that
 * has the form value in the {column} field.
 *
 * @param {Model} coll: The collection.
 * @param {String} column: The name of the field.
 * @param {String} msg: The failure message.
 */
exports.uniqueField = function (coll, column, msg) {
  return function(form, field, callback) {
    coll.findOne().where(column, field.data).exec(function(err, doc) {
      if (_.isNull(doc)) callback();
      else callback(msg);
    });
  };
};


/**
 * Pass if there is not already a document in the collection that
 * has the form value in the {column} field, excluding the {self}
 * document. Used for edit forms to allow unchanged unique parameters.
 *
 * @param {Model} coll: The collection.
 * @param {String} column: The name of the field.
 * @param {Document} self: The document to exclude.
 * @param {String} msg: The failure message.
 */
exports.uniqueNonSelfField = function (coll, column, self, msg) {
  return function(form, field, callback) {
    coll.findOne().where(column, field.data).exec(function(err, doc) {
      if (_.isNull(doc) || doc.id === self.id) callback();
      else callback(msg);
    });
  };
};


/**
 * Pass if the field data is a valid poem url slug.
 *
 * @param {String} msg: The failure message.
 */
exports.validSlug = function (msg) {
  return function(form, field, callback) {
    if (field.data.match(/^[a-z0-9_\-]+$/)) callback();
    else callback(msg);
  };
};
