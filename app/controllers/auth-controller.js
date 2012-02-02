/*
 * Authentication controller
 */

// Module dependencies.
var forms = require('../../helpers/forms')
var auth = require('../../helpers/auth')

// Models.
var User = mongoose.model('User');

// Controller actions.
module.exports = function(app) {

    /*
     * GET /admin/login
     */
    app.get('/admin/login', auth.anonUser, function(req, res) {
        res.render('auth/login', {
            title: 'Login',
            form: forms.authForms.login(),
            layout: '_layouts/auth'
        });
    });

    /*
     * POST /admin/login
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
                    title: 'Login',
                    form: form,
                    layout: '_layouts/auth'
                });
            }

        });

    });

    /*
     * GET /admin/logout
     */
    app.get('/admin/logout', function(req, res) {
        req.session.destroy(function() {});
        res.redirect('/admin/login');
    });

}
