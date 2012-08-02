/*
 * Admin controller
 */

// Module dependencies.
var poemForm = require('../../helpers/forms/poem');
var scoring = require('../../app/scoring/scoring');
var auth = require('../../helpers/middleware');
var async = require('async');
var _ = require('underscore');

// Models.
var Poem = mongoose.model('Poem');
var Round = mongoose.model('Round');


/*
 * -------------
 * Admin routes.
 * -------------
 */

// Controller actions.
module.exports = function(app, io) {

  /*
   * Redirect to /admin/poems.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin',
    auth.isUser,
    function(req, res) {
      res.redirect('/admin/poems');
  });

  /*
   * Show poems.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin/poems',
    auth.isUser,
    function(req, res) {

      // Get poems, sort by date created.
      Poem.find({
        user: req.user.id
      }).sort('created', -1).execFind(function(err, poems) {

        // Render the list.
        res.render('admin/index', {
          title:  'Oversoul',
          user:   req.user,
          poems:  poems
        });

      });

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
      res.render('admin/new', {
        title:  'New Poem',
        user:   req.user,
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

      // Pass control to the form.
      poemForm.form().handle(req, {

        // If field validations pass.
        success: function(form) {

          // Create the poem.
          var poem = new Poem({
            user:           req.user.id,
            roundLength:    form.data.roundLength,
            minSubmissions: form.data.minSubmissions,
            submissionVal:  form.data.submissionVal,
            decayLifetime:  form.data.decayLifetime,
            seedCapital:    form.data.seedCapital,
            sliceInterval:  app.settings.sliceInterval,
            visibleWords:   app.settings.visibleWords
          });

          // Save and redirect.
          poem.save(function(err) {
            res.redirect('/admin/poems');
          });

        },

        // If field validations fail.
        other: function(form) {

          // Re-render the form.
          res.render('admin/new', {
            title:  'New Poem',
            user:   req.user,
            form:   form
          });

        }

      });

  });

  /*
   * Edit a poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.getPoem: Pass the poem identified by :slug.
   * @middleware auth.ownsPoem: Pass if the poem belongs to the user.
   * @middleware auth.unstartedPoem: Block if the poem is started.
   */
  app.get('/admin/poems/edit/:hash',
    auth.isUser,
    auth.getPoem,
    auth.ownsPoem,
    auth.unstartedPoem,
    function(req, res) {

      var form = poemForm.form(req.poem).bind({
        slug:           req.poem.slug,
        roundLength:    req.poem.roundLength,
        sliceInterval:  req.poem.sliceInterval,
        minSubmissions: req.poem.minSubmissions,
        submissionVal:  req.poem.submissionVal,
        decayLifetime:  req.poem.decayLifetime,
        seedCapital:    req.poem.seedCapital,
        visibleWords:   req.poem.visibleWords
      });

      // Render the form.
      res.render('admin/edit', {
        title:  'Edit Poem',
        user:   req.user,
        poem:   req.poem,
        form:   form
      });

  });

  /*
   * Handle edit form.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.getPoem: Pass the poem identified by :slug.
   * @middleware auth.ownsPoem: Pass if the poem belongs to the user.
   * @middleware auth.unstartedPoem: Block if the poem is started.
   */
  app.post('/admin/poems/edit/:hash',
    auth.isUser,
    auth.getPoem,
    auth.ownsPoem,
    auth.unstartedPoem,
    function(req, res) {

      // Pass control to the form.
      poemForm.form(req.poem).handle(req, {

        // If field validations pass.
        success: function(form) {

          // Update the poem.
          req.poem.slug =             form.data.slug;
          req.poem.roundLength =      form.data.roundLength;
          req.poem.minSubmissions =   form.data.minSubmissions;
          req.poem.submissionVal =    form.data.submissionVal;
          req.poem.decayLifetime =    form.data.decayLifetime;
          req.poem.seedCapital =      form.data.seedCapital;

          // Save and redirect.
          req.poem.save(function(err) {
            res.redirect('/admin/poems');
          });

        },

        // If field validations fail.
        other: function(form) {

          // Re-render the form.
          res.render('admin/edit', {
            title:  'Edit Poem',
            user:   req.user,
            poem:   req.poem,
            form:   form
          });

        }

      });

  });

  /*
   * Delete poem confirmation page.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.getPoem: Pass the poem identified by :slug.
   * @middleware auth.ownsPoem: Pass if the poem belongs to the user.
   */
  app.get('/admin/poems/delete/:hash',
    auth.isUser,
    auth.getPoem,
    auth.ownsPoem,
    function(req, res) {

      // Render the form.
      res.render('admin/delete', {
        title:  'Delete Poem',
        user:   req.user,
        poem:   req.poem
      });

  });

  /*
   * Delete poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.getPoem: Pass the poem identified by :slug.
   * @middleware auth.ownsPoem: Pass if the poem belongs to the user.
   */
  app.post('/admin/poems/delete/:hash',
    auth.isUser,
    auth.getPoem,
    auth.ownsPoem,
    function(req, res) {

      // Stop poem..
      req.poem.stop();

      // Remove and redirect.
      req.poem.remove(function(err) {
        res.redirect('/admin/poems');
      });

  });

  /*
   * Start poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.getPoem: Pass the poem identified by :slug.
   * @middleware auth.ownsPoem: Pass if the poem belongs to the user.
   */
  app.get('/admin/poems/start/:hash',
    auth.isUser,
    auth.getPoem,
    auth.ownsPoem,
    function(req, res) {

      // Broadcast callback.
      var emit = function(result) {
        io.sockets.in(req.poem.slug).emit('slice', result);
      };

      // Create starting round, start.
      if (req.poem.unstarted) req.poem.newRound();
      req.poem.start(scoring.execute, emit, function() {});

      // Save and redirect.
      req.poem.save(function(err) {
        res.redirect('/admin/poems');
      });

  });

  /*
   * Stop poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.getPoem: Pass the poem identified by :slug.
   * @middleware auth.ownsPoem: Pass if the poem belongs to the user.
   */
  app.get('/admin/poems/stop/:hash',
    auth.isUser,
    auth.getPoem,
    auth.ownsPoem,
    function(req, res) {

      // Stop poem.
      req.poem.stop();

      // Save and redirect.
      req.poem.save(function(err) {
        res.redirect('/admin/poems');
      });

  });

};
