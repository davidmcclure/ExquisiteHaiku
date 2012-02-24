/*
 * Admin controller
 */

// Module dependencies.
var auth = require('../../helpers/middleware');


/*
 * ----------------------
 * Admin index routes.
 * ----------------------
 */

// Controller actions.
module.exports = function(app) {

  /*
   * Show poems.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin',
    auth.isUser,
    function(req, res) {

      // Render the list.
      res.render('admin/index', {
        title:  'Oversoul',
        layout: '_layouts/admin',
        user:   req.user,
        nav:    { main: '', sub: '' }
      });

  });

};
