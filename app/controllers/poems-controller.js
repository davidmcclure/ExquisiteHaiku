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
        poem:   req.poem
      });

  });

  /*
   * Register user.
   */
  app.post('/:slug/register',
    function(req, res) {
      res.send('POST /:slug/login');
  });

  /*
   * Log user in.
   */
  app.post('/:slug/login',
    function(req, res) {
      res.send('POST /:slug/login');
  });

  /*
   * Log user out.
   */
  app.post('/:slug/logout',
    function(req, res) {
      res.send('POST /:slug/logout');
  });

  /*
   * Validate a word.
   */
  app.get('/:slug/validate',
    function(req, res) {
      res.send('GET /:slug/validate');
  });

  /*
   * Process blind submissions.
   */
  app.post('/:slug/submit',
    function(req, res) {
      res.send('POST /:slug/submit');
  });

  /*
   * Process vote.
   */
  app.post('/:slug/vote',
    function(req, res) {
      res.send('POST /:slug/vote');
  });

};
