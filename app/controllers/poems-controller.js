/*
 * Poems controller
 */

// Module dependencies.
var poemForm = require('../../helpers/forms/poem'),
  auth = require('../../helpers/middleware'),
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
   * Show poems.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin/poems',
    auth.isUser,
    function(req, res) {

      // Build the filter object.
      var filter = {};
      switch (req.query.filter) {

        // Not-running, not-complete.
        case 'idle':
          filter.running = false;
          filter.complete = false;
        break;

        // In progress.
        case 'running':
          filter.running = true;
        break;

        // Finished.
        case 'done':
          filter.complete = true;
        break;

      }

      // Get subnav string.
      var subnav = _.isUndefined(req.query.filter) ?
        'all' : req.query.filter;

      // Admin user.
      if (req.user.admin) {

        // Add admin clause to filter.
        filter.admin = true;

        // Get admin poems, sorting by date created.
        Poem.find(
          filter
        ).sort('created', 1).execFind(function(err, poems) {

          // Render the list.
          res.render('admin/poems/index', {
            title:  'Oversoul',
            layout: '_layouts/poems',
            user:   req.user,
            nav:    { main: 'poems', sub: subnav },
            poems:  poems
          });

        });

      }

      // Public user.
      else {

        // Add user clause to filter.
        filter.user = req.user.id;

        // Get user's poems, sorting by date created.
        Poem.find(
          filter
        ).sort('created', 1).execFind(function(err, poems) {

          // Render the list.
          res.render('admin/poems/index', {
            title:  'Oversoul',
            layout: '_layouts/poems',
            user:   req.user,
            nav:    { main: 'poems', sub: subnav },
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
  app.get('/admin/poems/new',
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
  app.post('/admin/poems/new',
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
              res.redirect('/admin/poems');
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
              res.redirect('/admin/poems');
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
   * View a poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin/poems/show/:slug',
    auth.isUser,
    function(req, res) {

      // Get the poem.
      Poem.findOne({
        slug: req.params.slug
      }, function(err, poem) {

        // Show the info.
        res.render('admin/poems/show', {
          title:  poem.slug,
          layout: '_layouts/poems',
          user:   req.user,
          nav:    { main: 'poems', sub: 'show' },
          poem:   poem
        });

      });

  });

  /*
   * Edit a poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin/poems/edit/:slug',
    auth.isUser,
    function(req, res) {

  });

  /*
   * Handle poem form.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.post('/admin/poems/edit/:slug',
    auth.isUser,
    function(req, res) {

  });

  /*
   * Delete poem confirmation page.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin/poems/delete/:slug',
    auth.isUser,
    function(req, res) {

  });

  /*
   * Delete poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.post('/admin/poems/delete/:slug',
    auth.isUser,
    function(req, res) {

  });

  /*
   * Start poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.post('/admin/poems/start/:slug',
    auth.isUser,
    function(req, res) {

      // Get the poem.
      Poem.findOne({
        slug: req.params.slug
      }, function(err, poem) {
        poem.start();
      });

  });

  /*
   * Stop poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.post('/admin/poems/stop/:slug',
    auth.isUser,
    function(req, res) {

      // Get the poem.
      Poem.findOne({
        slug: req.params.slug
      }, function(err, poem) {
        poem.stop();
      });

  });

};
