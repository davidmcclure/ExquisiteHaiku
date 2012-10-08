/*
 * Admin controller
 */

// Module dependencies.
var auth = require('../../helpers/middleware');


/*
 * -------------
 * Admin routes.
 * -------------
 */

// Controller actions.
module.exports = function(app) {

  /*
   * Front page.
   */
  app.get('/',
    auth.getUser,
    function(req, res) {
    res.send('test');

    // Render the layout.
    // res.render('admin/index', {
      // title: 'equisitehaiku',
      // user: req.user,
      // menu: 'index'
    // });

  });

};
