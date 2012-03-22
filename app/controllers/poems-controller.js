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

      // Render the layout.
      res.render('admin/poems/edit', {
        title:  'Edit Poem',
        layout: '_layouts/admin',
        user:   req.user,
        nav:    { main: 'poems', sub: '' },
        poem:   req.poem,
        form:   form
      });

  });

};
