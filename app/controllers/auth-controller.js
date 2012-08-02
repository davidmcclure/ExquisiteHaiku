/*
 * Authentication controller
 */

// Module dependencies.
var loginForm = require('../../helpers/forms/login');
var auth = require('../../helpers/middleware');

// Models.
var User = mongoose.model('User');


/*
 * ----------------------
 * Authentication routes.
 * ----------------------
 */


// Controller actions.
module.exports = function(app) {

  /*
   * Show login form.
   *
   * @middleware auth.noUser: Block if there is a user session.
   */
  app.get('/admin/login',
    auth.noUser,
    function(req, res) {

      // Render form.
      res.render('auth/login', {
        title:  'Login',
        form:   loginForm.form()
      });

  });

  /*
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
              res.redirect('/admin/poems');
            }

          });

        },

        // If validations fail.
        other: function(form) {

          // Re-render the form.
          res.render('auth/login', {
            title:  'Login',
            form:   form
          });

        }

      });

  });

  /*
   * Log user out.
   */
  app.get('/admin/logout',
    function(req, res) {

      // Unset the session object.
      req.session.destroy(function() {
        res.redirect('/admin/login');
      });

  });

};
