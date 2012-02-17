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
      if (user.active) next();
      else res.redirect('/admin/login');
    });

  }

  // If no session id, redirect to login.
  else res.redirect('/admin/login');

};






/*
 * Only allow superusers. Depends on isUser to pass user document.
 *
 * @return void.
 */
// exports.isSuper = function (req, res, next) {
//   if (req.user.superUser) next();
//   else res.redirect('/admin');
// };


/*
 * Only allow anonymous users.
 *
 * @return void.
 */
// exports.anonUser = function (req, res, next) {
//   if (req.session.user_id) res.redirect('/admin');
//   else next();
// };


/*
 * Only allow when no users are registered in the system.
 *
 * - return void.
 */
// exports.noUsers = function (req, res, next) {
//   User.count({}, function(err, count) {
//     if (count > 0) res.redirect('/admin/login');
//     else next();
//   });
// };
