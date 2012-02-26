/*
 * Authentication middleware.
 */

// Models.
var User = mongoose.model('User');


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
 * Only allow super users. Called after isUser, which passes user
 * document.
 *
 * @param {Object} req: The request, with a user attribute.
 * @param {Object} res: The response.
 * @param {Callback} next: The next middleware.
 *
 * @return void.
 */
exports.isSuper = function (req, res, next) {
  if (req.user.superUser) next();
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
 * Only allow non-self users. Called after isUser, which passed user
 * document.
 *
 * @param {Object} req: The request.
 * @param {Object} res: The response.
 * @param {Callback} next: The next middleware.
 *
 * @return void.
 */
exports.nonSelf = function (req, res, next) {

  // Get the user record, push into request.
  User.findOne({ username: req.params.username }, function(err, user) {
    if (user.id !== req.user.id) {
      req.user = user;
      next();
    }
    else res.redirect('/admin');
  });

};
