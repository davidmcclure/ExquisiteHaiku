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
  app.get('/', 
    auth.getUser,
    function(req, res) {

    // Render the layout.
    res.render('admin/index', {
      title: 'equisitehaiku',
      user: req.user,
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
          title: 'equisitehaiku',
          user: req.user,
          poems: poems,
          menu: null
        });

      });

  });

  /*
   * New poem form.
   *
   * @middleware auth.getUser: Try to get a user session.
   */
  app.get('/admin/new',
    auth.getUser,
    function(req, res) {

      // Render the form.
      res.render('admin/new', {
        title: 'New Poem',
        user: req.user,
        form: poemForm.form(),
        menu: 'new'
      });

  });

  /*
   * Handle poem form submission.
   *
   * @middleware auth.getUser: Try to get a user session.
   */
  app.post('/admin/new',
    auth.getUser,
    function(req, res) {

      // Pass control to the form.
      poemForm.form().handle(req, {

        // If validations pass.
        success: function(form) {

          // Create the poem.
          var poem = new Poem({
            seedCapital:        form.data.seedCapital,
            roundLengthValue:   form.data.roundLengthValue,
            roundLengthUnit:    form.data.roundLengthUnit,
            submissionVal:      form.data.submissionVal,
            decayLifetime:      form.data.decayLifetime,
            sliceInterval:      form.data.sliceInterval,
            visibleWords:       form.data.visibleWords,
            published:          form.data.published
          });

          // If session, store user id.
          if (req.user) poem.user = req.user.id;

          // Save and redirect.
          poem.save(function(err) {
            res.redirect('/' + poem.hash + '/admin');
          });

        },

        // If validations fail.
        other: function(form) {

          // Re-render the form.
          res.render('admin/new', {
            title: 'New Poem',
            user: req.user,
            form: form,
            menu: 'new'
          });

        }

      });

  });

};
