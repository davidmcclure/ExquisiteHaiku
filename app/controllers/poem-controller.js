
/**
 * Poems controller
 */

var auth = require('../../helpers/middleware');
var _ = require('underscore');


module.exports = function(app) {

  /**
   * Run the poem.
   *
   * @middleware auth.getPoem: Pass the poem identified by :slug.
   */
  app.get('/:hash', auth.getPoem, function(req, res) {

    // Render the layout.
    res.render('poem/index', {
      title: req.params.hash,
      poem: JSON.stringify(req.poem)
    });

  });

};
