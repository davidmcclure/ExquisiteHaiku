/*
 * Poems controller
 */

// Module dependencies.
var auth = require('../../helpers/middleware');


/*
 * ------------
 * Poem routes.
 * ------------
 */

// Controller actions.
module.exports = function(app) {

  /*
   * Show poems.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin',
    auth.isUser,
    function(req, res) {

      // Render the list.
      res.render('admin/poems/index', {
        title:  'Oversoul',
        layout: '_layouts/admin',
        user:   req.user,
        nav:    { main: '', sub: '' }
      });

  });

  /*
   * New poem form.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin/new',
    auth.isUser,
    function(req, res) {

  });

  /*
   * Handle poem form submission.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.post('/admin/new',
    auth.isUser,
    function(req, res) {

  });

  /*
   * Edit a poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin/edit/:slug',
    auth.isUser,
    function(req, res) {

  });

  /*
   * Handle poem form.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.post('/admin/edit/:slug',
    auth.isUser,
    function(req, res) {

  });

  /*
   * Delete poem confirmation page.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin/delete/:slug',
    auth.isUser,
    function(req, res) {

  });

  /*
   * Delete poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.post('/admin/delete/:slug',
    auth.isUser,
    function(req, res) {

  });

  /*
   * Start poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin/start/:slug',
    auth.isUser,
    function(req, res) {

  });

  /*
   * Stop poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin/stop/:slug',
    auth.isUser,
    function(req, res) {

  });

};
