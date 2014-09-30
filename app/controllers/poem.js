
/**
 * Poems controller
 */

var _ = require('lodash');
var auth = require('../../helpers/middleware');


module.exports = function(app) {

  /**
   * Run the poem.
   *
   * @middleware auth.getPoem: Pass the poem identified by :slug.
   */
  app.get('/:hash', auth.getPoem, function(req, res) {

    // Render the layout.
    res.render('poem', {
      title: req.params.hash,
      poem: JSON.stringify(req.poem)
    });

  });

};
