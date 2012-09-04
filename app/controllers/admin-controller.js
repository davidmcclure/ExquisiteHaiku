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
   * Front page.
   */
  app.get('/', function(req, res) {

    // Render the layout.
    res.render('admin/index', {
      title: 'equisitehaiku',
      menu: 'index'
    });

  });

  /*
   * Show poems.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin',
    auth.isUser,
    function(req, res) {

      // Get poems, sort by date created.
      Poem.find({
        user: req.user.id
      }).sort('-created').execFind(function(err, poems) {

        // Render the list.
        res.render('admin/browse', {
          title: 'Oversoul',
          user: req.user,
          poems: poems,
          menu: null
        });

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

      // Render the form.
      res.render('admin/new', {
        title: 'New Poem',
        user: req.user,
        form: poemForm.form(),
        menu: null
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
            res.redirect('/admin');
          });

        },

        // If field validations fail.
        other: function(form) {

          // Re-render the form.
          res.render('admin/new', {
            title: 'New Poem',
            user: req.user,
            form: form,
            menu: null
          });

        }

      });

  });

};
