/*
 * Installation controller.
 */

// Module dependencies.
var installForm = require('../../helpers/forms/install');
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
   * Show installation form.
   *
   * @middleware auth.noUsers: Block if there is an existing user.
   */
  app.get('/admin/install',
    auth.noUsers,
    function(req, res) {

      // Render form.
      res.render('auth/install', {
        title:  'Installation',
        form:   installForm.form(),
        layout: '_layouts/auth'
      });

  });

  /*
   * Process installation form.
   *
   * @middleware auth.noUsers: Block if there is an existing user.
   */
  app.post('/admin/install',
    auth.noUsers,
    function(req, res) {

      installForm.form().handle(req, {

        // If validations pass.
        success: function(form) {

          // Create the user.
          var user = new User({
              username:   form.data.username,
              email:      form.data.email,
              password:   form.data.password,
              admin:      true
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
          res.render('auth/install', {
            title:  'Installation',
            form:   form,
            layout: '_layouts/auth'
          });

        }

      });

  });

};
