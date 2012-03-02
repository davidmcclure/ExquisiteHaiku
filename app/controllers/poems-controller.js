/*
 * Poems controller
 */

// Module dependencies.
var poemForm = require('../../helpers/forms/poem'),
  auth = require('../../helpers/middleware');

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
   * Show poems.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin',
    auth.isUser,
    function(req, res) {

      // Admin user.
      if (req.user.admin) {

        // Get admin poems, sorting by date created.
        Poem.find({
          admin: true
        }).sort('created', 1).execFind(function(err, poems) {

          // Render the list.
          res.render('admin/poems/index', {
            title:  'Oversoul',
            layout: '_layouts/poems',
            user:   req.user,
            nav:    { main: '', sub: '' },
            poems:  poems
          });

        });

      }

      // Public user.
      else {

        // Get user's poems, sorting by date created.
        Poem.find({
          user: req.user.id
        }).sort('created', 1).execFind(function(err, poems) {

          // Render the list.
          res.render('admin/poems/index', {
            title:  'Oversoul',
            layout: '_layouts/poems',
            user:   req.user,
            nav:    { main: '', sub: '' },
            poems:  poems
          });

        });

      }

  });

  /*
   * New poem form.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin/new',
    auth.isUser,
    function(req, res) {

      // Render the form.
      res.render('admin/poems/new', {
        title:  'New Poem',
        layout: '_layouts/poems',
        user:   req.user,
        nav:    { main: 'poems', sub: 'new' },
        form:   poemForm.form()
      });

  });

  /*
   * Handle poem form submission.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.post('/admin/new',
    auth.isUser,
    function(req, res) {

      // Admin user.
      if (req.user.admin) {

        // Pass control to the form.
        poemForm.form().handle(req, {

          // If field validations pass.
          success: function(form) {

            // Create the poem.
            var poem = new Poem({
              slug:           form.data.slug,
              user:           req.user.id,
              admin:          true,
              roundLength:    form.data.roundLength,
              sliceInterval:  form.data.sliceInterval,
              minSubmissions: form.data.minSubmissions,
              submissionVal:  form.data.submissionVal,
              decayLifetime:  form.data.decayLifetime,
              seedCapital:    form.data.seedCapital
            });

            // Save and redirect.
            poem.save(function(err) {
              res.redirect('/admin');
            });

          },

          // If field validations fail.
          other: function(form) {

            // Re-render the form.
            res.render('admin/poems/new', {
              title:  'New Poem',
              layout: '_layouts/poems',
              user:   req.user,
              nav:    { main: 'poems', sub: 'new' },
              form:   form
            });

          }

        });

      }

      // Public user.
      else {

        // Pass control to the form.
        poemForm.form(req.user).handle(req, {

          // If field validations pass.
          success: function(form) {

            // Create the poem.
            var poem = new Poem({
              slug:           form.data.slug,
              user:           req.user.id,
              admin:          false,
              roundLength:    form.data.roundLength,
              sliceInterval:  form.data.sliceInterval,
              minSubmissions: form.data.minSubmissions,
              submissionVal:  form.data.submissionVal,
              decayLifetime:  form.data.decayLifetime,
              seedCapital:    form.data.seedCapital
            });

            // Save and redirect.
            poem.save(function(err) {
              res.redirect('/admin');
            });

          },

          // If field validations fail.
          other: function(form) {

            // Re-render the form.
            res.render('admin/poems/new', {
              title:  'New Poem',
              layout: '_layouts/poems',
              user:   req.user,
              nav:    { main: 'poems', sub: 'new' },
              form:   form
            });

          }

        });

      }

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
