/*
 * Registration controller.
 */

// Module dependencies.
var registerForm = require('../../helpers/forms/register');
var auth = require('../../helpers/middleware');

// Models.
var User = mongoose.model('User');


/*
 * ---------------
 * Install routes.
 * ---------------
 */


// Controller actions.
module.exports = function(app) {

  /*
   * Show registration form.
   *
   * @middleware auth.noUser: Block if there is a user session.
   */
  app.get('/admin/register',
    auth.noUser,
    function(req, res) {

      // Render form.
      res.render('auth/register', {
        title:  'Register',
        form:   registerForm.form(),
        layout: '_layouts/auth'
      });

  });

  /*
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
              res.redirect('/admin/poems');
          });

        },

        // If validations fail.
        other: function(form) {

          // Re-render form.
          res.render('auth/register', {
            title:  'Register',
            form:   form,
            layout: '_layouts/auth'
          });

        }

      });

  });

};
