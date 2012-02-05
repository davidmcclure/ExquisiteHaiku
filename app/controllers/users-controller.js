/*
 * Users administration controller.
 */

// Module dependencies.
var forms = require('../../helpers/forms')
  , auth = require('../../helpers/auth');

// Models.
var User = mongoose.model('User');

// Controller actions.
module.exports = function(app) {

    /*
     * GET /admin/users
     */
    app.get('/admin/users', auth.loadUser, auth.isSuper, function(req, res) {

        // Get users.
        User.find(function(err, users) {
            res.render('admin/users/index', {
                title: 'Users',
                users: users,
                user: req.user,
                active: 'users',
                layout: '_layouts/users'
            });
        });

    });

    /*
     * GET /admin/users/new
     */
    app.get('/admin/users/new', auth.loadUser, auth.isSuper, function(req, res) {
        res.render('admin/users/new', {
            title: 'New User',
            user: req.user,
            active: 'users',
            form: forms.userForms.new(),
            layout: '_layouts/users'
        });
    });

    /*
     * POST /admin/users/new
     */
    app.post('/admin/users/new', auth.loadUser, auth.isSuper, function(req, res) {

        // Pass control to form.
        forms.userForms.new().handle(req, {

            // If field validations pass.
            success: function(form) {

                // Create the user.
                var user = new User({
                    username: form.data.username,
                    email: form.data.email,
                    password: form.data.password,
                    super: form.data.superUser,
                    active: form.data.active
                });

                // Save and redirect.
                user.save(function() {
                    res.redirect('/admin/users');
                });

            },

            // If field validations fail.
            other: function(form) {
                res.render('admin/users/new', {
                    title: 'New User',
                    user: req.user,
                    active: 'users',
                    form: form,
                    layout: '_layouts/users'
                });
            }

        });

    });

    /*
     * GET /admin/users/new
     */
    app.get('/admin/users/edit/:username', auth.loadUser, auth.isSuper, function(req, res) {

        // Get user.
        User.findOne({ username: req.params.username }, function(err, user) {

            // Get form and bind data.
            var form = forms.userForms.edit().bind({
                username: user.username,
                email: user.email,
                superUser: user.super,
                active: user.active
            });

            // Render.
            res.render('admin/users/edit', {
                title: 'Edit User',
                user: req.user,
                active: 'users',
                form: form,
                layout: '_layouts/users'
            });
        });

    });

    /*
     * POST /admin/users/new
     */
    app.post('/admin/users/edit/:username', auth.loadUser, auth.isSuper, function(req, res) {

        // Pass control to form.
        forms.userForms.edit().handle(req, {

            // If field validations pass.
            success: function(form) {

                // Get the user.

                // Save and redirect.
                user.save(function() {
                    res.redirect('/admin/users');
                });

            },

            // If field validations fail.
            other: function(form) {
                res.render('admin/users/edit', {
                    title: 'Edit User',
                    user: req.user,
                    active: 'users',
                    form: form,
                    layout: '_layouts/users'
                });
            }

        });

    });

}
