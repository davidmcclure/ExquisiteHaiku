/*
 * Authentication middleware.
 */

// Models.
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');


/*
 * -----------------
 * Route middleware.
 * -----------------
 */


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
 * Only allow admininstrators. Called after isUser, which passes user
 * document.
 *
 * @param {Object} req: The request, with a user attribute.
 * @param {Object} res: The response.
 * @param {Callback} next: The next middleware.
 *
 * @return void.
 */
exports.isAdmin = function (req, res, next) {
  if (req.user.admin) next();
  else res.redirect('/admin/poems');
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
  if (req.session.user_id) res.redirect('/admin/poems');
  else next();
};


/*
 * Only allow anonymous sessions when there are no users in the system.
 *
 * @param {Object} req: The request.
 * @param {Object} res: The response.
 * @param {Callback} next: The next middleware.
 *
 * @return void.
 */
exports.noUsers = function (req, res, next) {
  User.count({}, function(err, count) {
    if (count > 0) res.redirect('/admin/login');
    else next();
  });
};


/*
 * Load poem by way of :slug parameter on request.
 *
 * @param {Object} req: The request.
 * @param {Object} res: The response.
 * @param {Callback} next: The next middleware.
 *
 * @return void.
 */
exports.getPoem = function (req, res, next) {

  // Get the poem record, push into request.
  Poem.findOne({ slug: req.params.slug }, function(err, poem) {
    req.poem = poem;
    next();
  });

};
