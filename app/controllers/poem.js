
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
  app.get('/poem/:hash', auth.getPoem, function(req, res) {

    // If the poem is running, start the editor.
    if (req.poem.running) {
      res.render('poem', {
        title: req.params.hash,
        poem: JSON.stringify(req.poem)
      });
    }

    // Otherwise, just print out the words.
    else {
      res.render('admin/poem', {
        title: req.params.hash,
        poem: req.poem
      });
    }

  });

};
