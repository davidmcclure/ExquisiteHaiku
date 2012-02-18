/*
 * Installation controller.
 */

// Module dependencies.
var installForm = require('../../helpers/forms/install'),
  auth = require('../../helpers/middleware');

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
      res.send('POST /admin/install');
  });




    /*
     * Show install form.
     *
     * - middleware auth.noUsers: Block if there are any users in the
     *   database.
     */
    // app.get('/admin/install', auth.noUsers, function(req, res) {
    //     res.render('auth/install', {
    //         title:      'Installation',
    //         form:       forms.authForms.install(),
    //         layout:     '_layouts/auth'
    //     });
    // });


    /*
     * Process install form.
     *
     * - middleware auth.noUsers: Block if there are any users in the
     *   database.
     */
    // app.post('/admin/install', auth.anonUser, function(req, res) {

    //     // Pass control to form.
    //     forms.authForms.install().handle(req, {

    //         // If field validations pass.
    //         success: function(form) {

    //             // Create the user.
    //             var user = new User({
    //                 username:   form.data.username,
    //                 email:      form.data.email,
    //                 password:   form.data.password,
    //                 superUser:  true,
    //                 active:     true
    //             });

    //             // Save and redirect.
    //             user.save(function() {
    //                 req.session.user_id = user.id;
    //                 res.redirect('/admin');
    //             });

    //         },

    //         // If field validations fail.
    //         other: function(form) {
    //             res.render('auth/install', {
    //                 title:      'Install',
    //                 form:       form,
    //                 layout:     '_layouts/auth'
    //             });
    //         }

    //     });

    // });


};
