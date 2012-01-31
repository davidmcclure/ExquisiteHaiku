/*
 * Authentication middleware.
 */

// Models.
var User = mongoose.model('User');

// Check for user session, pass user record.
exports.loadUser = function (req, res, next) {

    // Check for user id in session.
    if (req.session.user_id) {

        // Get the user record, push into request.
        User.findById(req.session.user_id, function(err, user) {
            if (user) {
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

// If there is a user session, redirect to the admin.
exports.anonUser = function (req, res, next) {
    if (req.session.user_id) res.redirect('/admin');
    else next();
}
