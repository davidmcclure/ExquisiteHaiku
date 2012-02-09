/*
 * College administration routes.
 */

// Module dependencies.
var forms = require('../../helpers/forms')
  , auth = require('../../helpers/auth');

// Models.
var College = mongoose.model('College');


// Controller actions.
module.exports = function(app) {


    /*
     * Browse colleges.
     *
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/colleges',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get colleges.
        College.find(function(err, colleges) {

            // Render the list.
            res.render('admin/colleges/index', {
                title:      'Colleges',
                layout:     '_layouts/colleges',
                user:       req.user,
                colleges:   colleges,
                nav:        { main: 'colleges', sub: 'browse' }
            });

        });

    });


    /*
     * New college form.
     *
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/colleges/new',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Render form.
        res.render('admin/colleges/new', {
            title:      'New College',
            layout:     '_layouts/colleges',
            user:       req.user,
            form:       forms.collegeForms.new(),
            nav:        { main: 'colleges', sub: 'new' }
        });

    });


    /*
     * Process new college form submission. Rerender the form if validations
     * fail; create new college and redirect to colleges index if valid.
     *
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.post('/admin/colleges/new',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Pass control to form.
        forms.collegeForms.new().handle(req, {

            // If field validations pass.
            success: function(form) {

                // Create the college.
                var college = new College(form.data);

                // Save and redirect.
                college.save(function(err) {
                    res.redirect('/admin/colleges');
                });

            },

            // If field validations fail.
            other: function(form) {

                // Render the form.
                res.render('admin/colleges/new', {
                    title:      'New College',
                    layout:     '_layouts/colleges',
                    user:       req.user,
                    form:       form,
                    nav:        { main: 'colleges', sub: 'new' }
                });

            }

        });

    });


    /*
     * Edit a college.
     *
     * - param string slug: The slug of the college being edited.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    app.get('/admin/colleges/edit/:slug',
        auth.isUser,
        auth.isSuper,
        function(req, res) {

        // Get the college.
        College.findOne({ slug: req.params.slug }, function(err, college) {

            // Edit form.
            var form = forms.collegeForms.edit(college).bind(college);

            // Render form.
            res.render('admin/colleges/edit', {
                title:          'Edit College',
                layout:         '_layouts/colleges',
                user:           req.user,
                college:        college,
                form:           form,
                nav:            { main: 'colleges', sub: '' }
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
    // app.post('/admin/users/edit/:username/info',
    //     auth.isUser,
    //     auth.isSuper,
    //     function(req, res) {

    //     // Get the user.
    //     User.findOne({ username: req.params.username }, function(err, user) {

    //         // Information form.
    //         var infoForm = forms.userForms.editInformation(user);

    //         // Pass control to form.
    //         infoForm.handle(req, {

    //             // If field validations pass.
    //             success: function(form) {

    //                 // Update the user.
    //                 user.username = form.data.username;
    //                 user.email =    form.data.email;
    //                 user.super =    form.data.superUser;
    //                 user.active =   form.data.active;

    //                 // Save and redirect.
    //                 user.save(function() {
    //                     res.redirect('/admin/users');
    //                 });

    //             },

    //             // If field validations fail.
    //             other: function(form) {

    //                 // Password form.
    //                 var passwordForm = forms.userForms.changePassword();

    //                 // Render forms.
    //                 res.render('admin/users/edit', {
    //                     title:          'Edit User',
    //                     layout:         '_layouts/users',
    //                     user:           req.user,
    //                     editUser:       user,
    //                     infoForm:       infoForm,
    //                     passwordForm:   passwordForm,
    //                     nav:            { main: 'users', sub: '' }
    //                 });

    //             }

    //         });

    //     });

    // });


    /*
     * Process the change password form on the edit user page.
     *
     * - param string username: The username of the user being edited.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    // app.post('/admin/users/edit/:username/password',
    //     auth.isUser,
    //     auth.isSuper,
    //     function(req, res) {

    //     // Get the user.
    //     User.findOne({ username: req.params.username }, function(err, user) {

    //         // Information form.
    //         var passwordForm = forms.userForms.changePassword();

    //         // Pass control to form.
    //         passwordForm.handle(req, {

    //             // If field validations pass.
    //             success: function(form) {

    //                 // Update the user.
    //                 user.password = form.data.password;

    //                 // Save and redirect.
    //                 user.save(function() {
    //                     res.redirect('/admin/users');
    //                 });

    //             },

    //             // If field validations fail.
    //             other: function(form) {

    //                 // Information form.
    //                 var infoForm = forms.userForms.editInformation(user).bind({
    //                     username:   user.username,
    //                     email:      user.email,
    //                     superUser:  user.super,
    //                     active:     user.active
    //                 });

    //                 // Render forms.
    //                 res.render('admin/users/edit', {
    //                     title:          'Edit User',
    //                     layout:         '_layouts/users',
    //                     user:           req.user,
    //                     editUser:       user,
    //                     infoForm:       infoForm,
    //                     passwordForm:   passwordForm,
    //                     nav:            { main: 'users', sub: '' }
    //                 });

    //             }

    //         });

    //     });

    // });


    /*
     * Show delete user confirmation form.
     *
     * - param string username: The username of the user being deleted.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    // app.get('/admin/users/delete/:username',
    //     auth.isUser,
    //     auth.isSuper,
    //     function(req, res) {

    //     // Get the user.
    //     User.findOne({ username: req.params.username }, function(err, user) {

    //         // Render the form.
    //         res.render('admin/users/delete', {
    //             title:          'Delete User',
    //             layout:         '_layouts/users',
    //             user:           req.user,
    //             deleteUser:     user,
    //             nav:            { main: 'users', sub: '' }
    //         });

    //     });

    // });


    /*
     * Delete a user.
     *
     * - param string username: The username of the user being deleted.
     * - middleware auth.isUser: Block anonymous.
     * - middleware auth.isSuper: Block non-super users.
     */
    // app.post('/admin/users/delete/:username',
    //     auth.isUser,
    //     auth.isSuper,
    //     function(req, res) {

    //     // Get the user and delete.
    //     User.findOne({ username: req.params.username }, function(err, user) {
    //       user.remove(function(err) {
    //           res.redirect('/admin/users');
    //       });
    //     });

    // });


}
