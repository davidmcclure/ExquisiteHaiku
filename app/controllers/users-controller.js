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
     * GET /admin/users
     */
    app.get('/admin/users',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get users.
        User.find(function(err, users) {
            res.render('admin/users/index', {
                title:      'Users',
                layout:     '_layouts/users',
                user:       req.user,
                users:      users,
                nav:        { main: 'users', sub: 'browse' }
            });
        });

    });

    /*
     * GET /admin/users/new
     */
    app.get('/admin/users/new',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Render form.
        res.render('admin/users/new', {
            title:      'New User',
            layout:     '_layouts/users',
            user:       req.user,
            form:       forms.userForms.new(),
            nav:        { main: 'users', sub: 'new' }
        });

    });

    /*
     * POST /admin/users/new
     */
    app.post('/admin/users/new',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Pass control to form.
        forms.userForms.new().handle(req, {

            // If field validations pass.
            success: function(form) {

                // Create the user.
                var user = new User({
                    username:   form.data.username,
                    email:      form.data.email,
                    password:   form.data.password,
                    super:      form.data.superUser,
                    active:     form.data.active
                });

                // Save and redirect.
                user.save(function() {
                    res.redirect('/admin/users');
                });

            },

            // If field validations fail.
            other: function(form) {
                res.render('admin/users/new', {
                    title:      'New User',
                    layout:     '_layouts/users',
                    user:       req.user,
                    form:       form,
                    nav:        { main: 'users', sub: 'new' }
                });
            }

        });

    });

    /*
     * GET /admin/users/edit/:username
     */
    app.get('/admin/users/edit/:username',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the user.
        User.findOne({ username: req.params.username }, function(err, user) {

            // Information form.
            var infoForm = forms.userForms.editInformation(user).bind({
                username:   user.username,
                email:      user.email,
                superUser:  user.super,
                active:     user.active
            });

            // Password form.
            var passwordForm = forms.userForms.changePassword();

            // Render forms.
            res.render('admin/users/edit', {
                title:          'Edit User',
                layout:         '_layouts/users',
                user:           req.user,
                editUser:       user,
                infoForm:       infoForm,
                passwordForm:   passwordForm,
                nav:            { main: 'users', sub: '' }
            });

        });

    });

    /*
     * POST /admin/users/edit/:username/info
     */
    app.post('/admin/users/edit/:username/info',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the user.
        User.findOne({ username: req.params.username }, function(err, user) {

            // Information form.
            var infoForm = forms.userForms.editInformation(user);

            // Pass control to form.
            infoForm.handle(req, {

                // If field validations pass.
                success: function(form) {

                    // Update the user.
                    user.username = form.data.username;
                    user.email =    form.data.email;
                    user.super =    form.data.superUser;
                    user.active =   form.data.active;

                    // Save and redirect.
                    user.save(function() {
                        res.redirect('/admin/users');
                    });

                },

                // If field validations fail.
                other: function(form) {

                    // Password form.
                    var passwordForm = forms.userForms.changePassword();

                    // Render forms.
                    res.render('admin/users/edit', {
                        title:          'Edit User',
                        layout:         '_layouts/users',
                        user:           req.user,
                        editUser:       user,
                        infoForm:       infoForm,
                        passwordForm:   passwordForm,
                        nav:            { main: 'users', sub: '' }
                    });

                }

            });

        });

    });

    /*
     * POST /admin/users/edit/:username/password
     */
    app.post('/admin/users/edit/:username/password',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the user.
        User.findOne({ username: req.params.username }, function(err, user) {

            // Information form.
            var passwordForm = forms.userForms.changePassword();

            // Pass control to form.
            passwordForm.handle(req, {

                // If field validations pass.
                success: function(form) {

                    // Update the user.
                    user.password = form.data.password;

                    // Save and redirect.
                    user.save(function() {
                        res.redirect('/admin/users');
                    });

                },

                // If field validations fail.
                other: function(form) {

                    // Information form.
                    var infoForm = forms.userForms.editInformation(user).bind({
                        username:   user.username,
                        email:      user.email,
                        superUser:  user.super,
                        active:     user.active
                    });

                    // Render forms.
                    res.render('admin/users/edit', {
                        title:          'Edit User',
                        layout:         '_layouts/users',
                        user:           req.user,
                        editUser:       user,
                        infoForm:       infoForm,
                        passwordForm:   passwordForm,
                        nav:            { main: 'users', sub: '' }
                    });

                }

            });

        });

    });

    /*
     * GET /admin/users/delete/:username
     */
    app.get('/admin/users/delete/:username',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the user.
        User.findOne({ username: req.params.username }, function(err, user) {
            res.render('admin/users/delete', {
                title:          'Delete User',
                layout:         '_layouts/users',
                user:           req.user,
                deleteUser:     user,
                nav:            { main: 'users', sub: '' }
            });
        });

    });

    /*
     * POST /admin/users/delete/:username
     */
    app.post('/admin/users/delete/:username',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the user.
        User.findOne({ username: req.params.username }, function(err, user) {
          user.remove(function(err) {
              res.redirect('/admin/users');
          });
        });

    });

}
