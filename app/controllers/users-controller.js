/*
 * User administration routes.
 */

// Module dependencies.
var userForms = require('../../helpers/forms/user'),
  auth = require('../../helpers/middleware'),
  _ = require('underscore');

// Models.
var User = mongoose.model('User');


/*
 * ----------------------
 * User administration routes.
 * ----------------------
 */


// Controller actions.
module.exports = function(app) {

  /*
   * Browse users.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.isSuper: Block if user is not a super user.
   */
  app.get('/admin/users',
    auth.isUser,
    auth.isSuper,
    function(req, res) {

      // Get users, sort alphabetically ascending on username.
      User.find().sort('username', 1).execFind(function(err, users) {

        // Render the list.
        res.render('admin/users/index', {
          title:  'Users',
          layout: '_layouts/users',
          user:   req.user,
          nav:    { main: 'users', sub: 'browse' },
          users:  users
        });

      });

  });

  /*
   * New user form.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.isSuper: Block if user is not a super user.
   */
  app.get('/admin/users/new',
    auth.isUser,
    auth.isSuper,
    function(req, res) {

      // Render the form.
      res.render('admin/users/new', {
        title:  'Users',
        layout: '_layouts/users',
        user:   req.user,
        nav:    { main: 'users', sub: 'new' },
        form:   userForms.newUser()
      });

  });

  /*
   * Handle new user form submission.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.isSuper: Block if user is not a super user.
   */
  app.post('/admin/users/new',
    auth.isUser,
    auth.isSuper,
    function(req, res) {

      // Pass control to the form.
      userForms.newUser().handle(req, {

        // If field validations pass.
        success: function(form) {

          // Create the user.
          var user = new User({
            username:   form.data.username,
            email:      form.data.email,
            password:   form.data.password,
            superUser:  _.has(req.body, 'superUser'),
            active:     _.has(req.body, 'active')
          });

          // Save and redirect.
          user.save(function() {
            res.redirect('/admin/users');
          });

        },

        // If field validations fail.
        other: function(form) {

          // Re-render the form.
          res.render('admin/users/new', {
            title:  'Users',
            layout: '_layouts/users',
            user:   req.user,
            nav:    { main: 'users', sub: 'new' },
            form:   form
          });

        }

      });

  });

  /*
   * Edit a user account.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.isSuper: Block if user is not a super user.
   */
  app.get('/admin/users/edit/:username',
    auth.isUser,
    auth.isSuper,
    function(req, res) {

      // Get the user.
      User.findOne({
        username: req.params.username
      }, function(err, user) {

        // Information form.
        if (req.user.id !== user.id) {
          var infoForm = userForms.editInfo(user).bind({
            username:   user.username,
            email:      user.email,
            superUser:  user.superUser,
            active:     user.active
          });
        } else {
          var infoForm = userForms.editSelfInfo(user).bind({
            username:   user.username,
            email:      user.email
          });
        }

        // Password form.
        var passForm = userForms.editPassword();

        // Render forms.
        res.render('admin/users/edit', {
          title:      'Edit User',
          layout:     '_layouts/users',
          user:       req.user,
          nav:        { main: 'users', sub: '' },
          editUser:   user,
          infoForm:   infoForm,
          passForm:   passForm
        });

      });

  });

  /*
   * Handle edit information form.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.isSuper: Block if user is not a super user.
   */
  app.post('/admin/users/edit/:username/info',
    auth.isUser,
    auth.isSuper,
    function(req, res) {

      // Get the user.
      User.findOne({
        username: req.params.username
      }, function(err, user) {

        var infoForm;

        // Information form.
        if (user.id !== req.user.id) infoForm = userForms.editInfo(user);
        else infoForm = userForms.editSelfInfo(user);

        // Pass control to form.
        infoForm.handle(req, {

          // If field validations pass.
          success: function(form) {

            // Update the user.
            user.username = form.data.username;
            user.email = form.data.email;

            // Only set active and super for non-self edit
            if (user.id !== req.user.id) {
              user.superUser = _.has(req.body, 'superUser');
              user.active = _.has(req.body, 'active');
            }

            // Save and redirect.
            user.save(function() {
              res.redirect('/admin/users');
            });

          },

          // If field validations fail.
          other: function(form) {

            // Password form.
            var passForm = userForms.editPassword();

            // Render forms.
            res.render('admin/users/edit', {
              title:      'Edit User',
              layout:     '_layouts/users',
              user:       req.user,
              nav:        { main: 'users', sub: '' },
              editUser:   user,
              infoForm:   form,
              passForm:   passForm
            });

          }

        });

      });

  });

  /*
   * Handle change password form.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.isSuper: Block if user is not a super user.
   */
  app.post('/admin/users/edit/:username/password',
    auth.isUser,
    auth.isSuper,
    function(req, res) {

      // Get the user.
      User.findOne({
        username: req.params.username
      }, function(err, user) {

        var infoForm;
        var passForm = userForms.editPassword();

        // Pass control to form.
        passForm.handle(req, {

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
            if (user.id !== req.user.id) infoForm = userForms.editInfo(user);
            else infoForm = userForms.editSelfInfo(user);

            // Render forms.
            res.render('admin/users/edit', {
              title:      'Edit User',
              layout:     '_layouts/users',
              user:       req.user,
              nav:        { main: 'users', sub: '' },
              editUser:   user,
              infoForm:   infoForm,
              passForm:   form
            });

          }

        });

      });

  });

  /*
   * Delete user confirmation page.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.isSuper: Block if user is not a super user.
   */
  app.get('/admin/users/delete/:username',
    auth.isUser,
    auth.isSuper,
    function(req, res) {

      // Get the user.
      User.findOne({
        username: req.params.username
      }, function(err, user) {

        // Render the form.
        res.render('admin/users/delete', {
          title:    'Delete User',
          layout:   '_layouts/users',
          user:     req.user,
          nav:      { main: 'users', sub: '' },
          delUser:  user
        });

      });

  });

  /*
   * Delete user.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.isSuper: Block if user is not a super user.
   */
  app.post('/admin/users/delete/:username',
    auth.isUser,
    auth.isSuper,
    function(req, res) {

      // Get the user.
      User.findOne({
        username: req.params.username
      }, function(err, user) {

        // Remove and redirect.
        user.remove(function(err) {
          res.redirect('/admin/users');
        });

      });


  });

};
