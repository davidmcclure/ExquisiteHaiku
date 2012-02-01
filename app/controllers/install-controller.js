/*
 * Installation routes.
 */

// Module dependencies.
var forms = require('../../helpers/forms')
var auth = require('../../helpers/auth')

// Models.
var User = mongoose.model('User');

// Controller actions.
module.exports = function(app) {

    /*
     * GET /install
     */
    app.get('/admin/install', auth.noUsers, function(req, res) {
        console.log(forms.authForms.install());
        res.render('auth/install', {
            title: 'Installation',
            form: forms.authForms.install(),
            layout: '_layouts/admin'
        });
    });

    /*
     * POST /install
     */
    app.post('/admin/install', auth.anonUser, function(req, res) {

        // Pass control to form.
        forms.authForms.install().handle(req, {

            // If field validations pass.
            success: function(form) {

            },

            // If field validations fail.
            other: function(form) {
                console.log(form);
                res.render('auth/install', {
                    title: 'Install',
                    form: form,
                    layout: '_layouts/admin'
                });
            }

        });

    });

}
