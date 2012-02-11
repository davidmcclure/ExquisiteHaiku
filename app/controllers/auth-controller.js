/*
 * Authentication controller
 */

// Module dependencies.
var forms = require('../../helpers/forms'),
    auth = require('../../helpers/auth');

// Models.
var User = mongoose.model('User');

// Controller actions.
module.exports = function(app) {


    /*
     * Show login form.
     *
     * - middleware auth.anonUser: Block signed-in users.
     */
    app.get('/admin/login', auth.anonUser, function(req, res) {
        res.render('auth/login', {
            title:      'Login',
            form:       forms.authForms.login(),
            layout:     '_layouts/auth'
        });
    });


    /*
     * Process login form.
     *
     * - middleware auth.anonUser: Block signed-in users.
     */
    app.post('/admin/login', auth.anonUser, function(req, res) {

        // Pass control to form.
        forms.authForms.login().handle(req, {

            // If field validations pass.
            success: function(form) {

                // Try to find the user.
                User.findOne({
                    username: form.data.username
                }, function(err, user) {

                    // Authenticate and redirect.
                    if (user.authenticate(form.data.password)) {
                        req.session.user_id = user.id;
                        res.redirect('/admin');
                    }

                });

            },

            // If field validations fail.
            other: function(form) {
                res.render('auth/login', {
                    title:      'Login',
                    form:       form,
                    layout:     '_layouts/auth'
                });
            }

        });

    });


    /*
     * Log user out. Unset the user_id session key.
     */
    app.get('/admin/logout', function(req, res) {
        req.session.destroy(function() {});
        res.redirect('/admin/login');
    });


};
