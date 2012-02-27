/*
 * Registration controller.
 */

// Module dependencies.
var registerForm = require('../../helpers/forms/register'),
  auth = require('../../helpers/middleware');

// Models.
var User = mongoose.model('User');


/*
 * --------------------
 * Registration routes.
 * --------------------
 */


// Controller actions.
module.exports = function(app) {

  /*
   * Show registration form.
   */
  app.get('/admin/register',
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
   */
  app.post('/admin/register',
    function(req, res) {

      registerForm.form().handle(req, {

        // If validations pass.
        success: function(form) {

          // Create the user.
          var user = new User({
              username:   form.data.username,
              email:      form.data.email,
              password:   form.data.password,
              admin:      false,
              superUser:  false,
              active:     true
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
            title:  'Register',
            form:   form,
            layout: '_layouts/auth'
          });

        }

      });

  });

};
