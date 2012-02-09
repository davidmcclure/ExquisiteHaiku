/*
 * Authentication middleware.
 */

// Models.
var User = mongoose.model('User');


/*
 * Check for user session, pass user record to action.
 *
 * - return void.
 */
exports.isUser = function (req, res, next) {

    // Check for user id in session.
    if (req.session.user_id) {

        // Get the user record, push into request.
        User.findById(req.session.user_id, function(err, user) {
            if (user && user.active) {
                req.user = user;
                next();
            } else {
                res.redirect('/admin/login');
            }
        });
    }

    // If no session id, redirect to login.
    else res.redirect('/admin/login');

}


/*
 * Only allow superusers.
 *
 * - return void.
 */
exports.isSuper = function (req, res, next) {
    if (req.user.superUser) next();
    else res.redirect('/admin');
}


/*
 * If there is a user session, redirect to admin index.
 *
 * - return void.
 */
exports.anonUser = function (req, res, next) {
    if (req.session.user_id) res.redirect('/admin');
    else next();
}


/*
 * If a user exists, redirect to login.
 *
 * - return void.
 */
exports.noUsers = function (req, res, next) {
    User.count({}, function(err, count) {
        if (count > 0) res.redirect('/admin/login');
        else next();
    });
}
