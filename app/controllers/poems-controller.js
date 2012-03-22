/*
 * Poems controller
 */

// Module dependencies.
var auth = require('../../helpers/middleware'),
  _ = require('underscore');

// Models.
var Poem = mongoose.model('Poem');


/*
 * ------------
 * Poem routes.
 * ------------
 */

// Controller actions.
module.exports = function(app) {

  /*
   * The poem.
   */
  app.get('/:slug',
    function(req, res) {
      res.send(req.params.slug);
  });

};
