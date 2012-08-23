/*
 * Index controller
 */

// Module dependencies.
var _ = require('underscore');


/*
 * -------------
 * Index routes.
 * -------------
 */


// Controller actions.
module.exports = function(app) {

  /*
   * Front page.
   */
  app.get('/', function(req, res) {

    // Render the layout.
    res.render('index/index', {
      title: 'equisitehaiku'
    });

  });

};
