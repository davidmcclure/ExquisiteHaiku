/*
 * User administration routes.
 */

// Module dependencies.
var forms = require('../../helpers/forms'),
    auth = require('../../helpers/auth');

// Models.
var User = mongoose.model('User');


// Controller actions.
module.exports = function(app) {


    /*
     * Browse users.
     *
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/users',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get users, sorting alphabetically ascending on username.
        User.find().sort('username', 1).execFind(function(err, users) {

            // Render the list.
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
     * New user form.
     *
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
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
            form:       forms.userForms.newUser(),
            nav:        { main: 'users', sub: 'new' }
        });

    });


    /*
     * Process new user form submission. Rerender the form if validations
     * fail; create new user and redirect to users index if valid.
     *
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.post('/admin/users/new',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Pass control to form.
        forms.userForms.newUser().handle(req, {

            // If field validations pass.
            success: function(form) {

                // Create the user.
                var user = new User({
                    username:   form.data.username,
                    email:      form.data.email,
                    password:   form.data.password,
                    superUser:  form.data.superUser,
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
     * Edit a user account.
     *
     * - param string username: The username of the user being edited.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
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
                superUser:  user.superUser,
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
     * Process the edit information form on the edit user page.
     *
     * - param string username: The username of the user being edited.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
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
                    user.username =     form.data.username;
                    user.email =        form.data.email;

                    // Only set active and super if the user being edited is
                    // not the same as the editing user.
                    if (user.id != req.user.id) {
                        user.superUser =    form.data.superUser;
                        user.active =       form.data.active;
                    }

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
     * Process the change password form on the edit user page.
     *
     * - param string username: The username of the user being edited.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
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
                        superUser:  user.superUser,
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
     * Show delete user confirmation form.
     *
     * - param string username: The username of the user being deleted.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/users/delete/:username',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the user.
        User.findOne({ username: req.params.username }, function(err, user) {

            // Render the form.
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
     * Delete a user.
     *
     * - param string username: The username of the user being deleted.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.post('/admin/users/delete/:username',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the user and delete.
        User.findOne({ username: req.params.username }, function(err, user) {
          user.remove(function(err) {
              res.redirect('/admin/users');
          });
        });

    });


};
