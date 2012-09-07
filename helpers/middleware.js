/*
 * Authentication middleware.
 */

// Module dependencies.
var mongoose = require('mongoose');

// Models.
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');


/*
 * -----------------
 * Route middleware.
 * -----------------
 */


/*
 * If there is a session, attach the user to the request. If
 * there is not a session, attach req.user = false.
 *
 * @param {Object} req: The request.
 * @param {Object} res: The response.
 * @param {Callback} next: The next middleware.
 *
 * @return void.
 */
exports.getUser = function (req, res, next) {

  req.user = false;

  // Check for user id in session.
  if (req.session.user_id) {

    // Get the user record, push into request.
    User.findById(req.session.user_id, function(err, user) {
      if (user) { req.user = user; next(); }
    });

  }

};


/*
 * Only allow authenticated users.
 *
 * @param {Object} req: The request.
 * @param {Object} res: The response.
 * @param {Callback} next: The next middleware.
 *
 * @return void.
 */
exports.isUser = function (req, res, next) {

  // Check for user id in session.
  if (req.session.user_id) {

    // Get the user record, push into request.
    User.findById(req.session.user_id, function(err, user) {
      if (user) {
        req.user = user;
        next();
      }
      else res.redirect('/admin/login');
    });

  }

  // If no session id, redirect to login.
  else res.redirect('/admin/login');

};


/*
 * Only allow anonymous sessions.
 *
 * @param {Object} req: The request.
 * @param {Object} res: The response.
 * @param {Callback} next: The next middleware.
 *
 * @return void.
 */
exports.noUser = function (req, res, next) {
  if (req.session.user_id) res.redirect('/admin');
  else next();
};


/*
 * Attach poem to the request.
 *
 * @param {Object} req: The request.
 * @param {Object} res: The response.
 * @param {Callback} next: The next middleware.
 *
 * @return void.
 */
exports.getPoem = function (req, res, next) {

  // Get the poem record, push into request.
  Poem.findOne({ hash: req.params.hash }, function(err, poem) {
    req.poem = poem;
    next();
  });

};


/*
 * Only allow the owner of the poem with the :slug passed in
 * from the route. Called after isUser and getPoem, which pass
 * the poem and user documents.
 *
 * @param {Object} req: The request.
 * @param {Object} res: The response.
 * @param {Callback} next: The next middleware.
 *
 * @return void.
 */
exports.ownsPoem = function (req, res, next) {
  if (req.poem.user == req.user.id) next();
  else res.redirect('/admin');
};


/*
 * Only allow when req.poem has not been started. Called after
 * getPoem, which passes the poem document.
 *
 * @param {Object} req: The request.
 * @param {Object} res: The response.
 * @param {Callback} next: The next middleware.
 *
 * @return void.
 */
exports.unstartedPoem = function (req, res, next) {
  if (!req.poem.started) next();
  else res.redirect('/admin');
};
