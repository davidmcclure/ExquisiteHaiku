
/**
 * Admin controller
 */

var auth = require('../../helpers/middleware');


/*
 * -------------
 * Admin routes.
 * -------------
 */

module.exports = function(app) {

  /**
   * Front page.
   */
  app.get('/',
    auth.getUser,
    function(req, res) {

    // Render the layout.
    res.render('admin/index', {
      title: 'equisitehaiku',
      user: req.user,
      menu: 'index'
    });

  });

};
