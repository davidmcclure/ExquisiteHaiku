/*
 * Installation routes.
 */

// Module dependencies.
var forms = require('../../helpers/forms')
  , auth = require('../../helpers/auth');

// Models.
var User = mongoose.model('User');

// Controller actions.
module.exports = function(app) {


    /*
     * Show install form.
     *
     * - middleware auth.noUsers: Block if there are any users in the
     *   database.
     */
    app.get('/admin/install', auth.noUsers, function(req, res) {
        res.render('auth/install', {
            title:      'Installation',
            form:       forms.authForms.install(),
            layout:     '_layouts/auth'
        });
    });


    /*
     * Process install form.
     *
     * - middleware auth.noUsers: Block if there are any users in the
     *   database.
     */
    app.post('/admin/install', auth.anonUser, function(req, res) {

        // Pass control to form.
        forms.authForms.install().handle(req, {

            // If field validations pass.
            success: function(form) {

                // Create the user.
                var user = new User({
                    username:   form.data.username,
                    email:      form.data.email,
                    password:   form.data.password,
                    super:      true,
                    active:     true
                });

                // Save and redirect.
                user.save(function() {
                    req.session.user_id = user.id;
                    res.redirect('/admin');
                });

            },

            // If field validations fail.
            other: function(form) {
                res.render('auth/install', {
                    title:      'Install',
                    form:       form,
                    layout:     '_layouts/auth'
                });
            }

        });

    });

}
