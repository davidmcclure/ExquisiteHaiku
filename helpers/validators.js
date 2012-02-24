/*
 * Custom form validators methods.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
var User = mongoose.model('User');


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
 * Pass if user with username is active.
 *
 * @param {String} msg: The failure message.
 *
 * @return void.
 */
exports.usernameActive = function (msg) {
  return function(form, field, callback) {
    User.findOne({ username: field.data }, function(err, user) {
      if (!_.isNull(user) && user.active) callback();
      else callback(msg);
    });
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
      if (user.authenticate(field.data)) callback();
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
    coll.findOne().where(column, field.data).run(function(err, doc) {
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
    coll.findOne().where(column, field.data).run(function(err, doc) {
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
    var pattern = new RegExp('/[a-z0-9_\-]+/');
    if (pattern.test(field.data)) {
      console.log('match');
      callback();
    }
    else callback(msg);
  };
};
