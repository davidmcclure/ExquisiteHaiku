/*
 * Poems controller
 */

// Module dependencies.
var auth = require('../../helpers/middleware');
var _ = require('underscore');


/*
 * ------------
 * Poem routes.
 * ------------
 */


// Controller actions.
module.exports = function(app) {

  /*
   * Run the poem.
   *
   * @middleware auth.getPoem: Pass the poem identified by :slug.
   */
  app.get('/:slug',
    auth.getPoem,
    function(req, res) {

      // Render the layout.
      res.render('poem/index', {
        title:  req.params.slug,
        layout: '_layouts/poem',
        poem:   JSON.stringify({ slug: req.poem.slug })
      });

  });

};
