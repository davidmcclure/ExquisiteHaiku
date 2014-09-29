
/**
 * Authentication controller
 */

var mongoose = require('mongoose');
var loginForm = require('../../helpers/forms/login');
var registerForm = require('../../helpers/forms/register');
var auth = require('../../helpers/middleware');
var User = mongoose.model('User');


module.exports = function(app) {

  /**
   * Show registration form.
   *
   * @middleware auth.noUser: Block if there is a user session.
   */
  app.get('/admin/register',
    auth.noUser,
    function(req, res) {

      // Render form.
      res.render('auth/register', {
        title: 'Register',
        form: registerForm.form(),
        user: false,
        menu: 'register'
      });

  });

  /**
   * Process registration form.
   *
   * @middleware auth.noUser: Block if there is a user session.
   */
  app.post('/admin/register',
    auth.noUser,
    function(req, res) {

      registerForm.form().handle(req, {

        // If validations pass.
        success: function(form) {

          // Create the user.
          var user = new User({
              username: form.data.username,
              password: form.data.password,
              email: form.data.email
          });

          // Save and redirect.
          user.save(function() {
              req.session.user_id = user.id;
              res.redirect('/admin');
          });

        },

        // If validations fail.
        other: function(form) {

          // Re-render form.
          res.render('auth/register', {
            title: 'Register',
            form: form,
            user: false,
            menu: 'register'
          });

        }

      });

  });

  /**
   * Show login form.
   *
   * @middleware auth.noUser: Block if there is a user session.
   */
  app.get('/admin/login',
    auth.noUser,
    function(req, res) {

      // Render form.
      res.render('auth/login', {
        title: 'Login',
        form: loginForm.form(),
        user: false,
        menu: 'login'
      });

  });

  /**
   * Process login form.
   *
   * @middleware auth.noUser: Block if there is a user session.
   */
  app.post('/admin/login',
    auth.noUser,
    function(req, res) {

      loginForm.form().handle(req, {

        // If validations pass.
        success: function(form) {

          // Get the user.
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

        // If validations fail.
        other: function(form) {

          // Re-render the form.
          res.render('auth/login', {
            title: 'Login',
            form: form,
            user: false,
            menu: 'login'
          });

        }

      });

  });

  /**
   * Log user out.
   */
  app.get('/admin/logout',
    function(req, res) {

      // Clear the session.
      req.session = null;
      res.redirect('/admin/login');

  });

};
