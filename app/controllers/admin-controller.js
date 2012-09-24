/*
 * Admin controller
 */

// Module dependencies.
var mongoose = require('mongoose');
var poemForm = require('../../helpers/forms/poem');
var scoring = require('../../app/scoring/scoring');
var auth = require('../../helpers/middleware');
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
   * Show poems.
   *
   * @middleware auth.isUser: Block if there is no user session.
   */
  app.get('/admin',
    auth.isUser,
    function(req, res) {

      // Get poems, sort by date created.
      Poem
      .find({ user: req.user.id })
      .sort('-created')
      .exec(function(err, poems) {

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
    auth.isUser,
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
    auth.isUser,
    function(req, res) {

      // Pass control to the form.
      poemForm.form().handle(req, {

        // If validations pass.
        success: function(form) {

          // Create the poem.
          var poem = new Poem({
            user:               req.user.id,
            seedCapital:        form.data.seedCapital,
            roundLengthValue:   form.data.roundLengthValue,
            roundLengthUnit:    form.data.roundLengthUnit,
            submissionVal:      form.data.submissionVal,
            minSubmissions:     form.data.minSubmissions,
            decayHalflife:      form.data.decayHalflife,
            sliceInterval:      config.sliceInterval,
            visibleWords:       config.visibleWords,
            published:          form.data.published
          });

          // Save and redirect.
          poem.save(function(err) {
            res.redirect('/admin');
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

  /*
   * Delete poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.getPoem: Pass the poem identified by :slug.
   * @middleware auth.ownsPoem: Pass if the poem belongs to the user.
   */
  app.post('/admin/delete/:hash',
    auth.isUser,
    auth.getPoem,
    auth.ownsPoem,
    function(req, res) {

      // Stop poem..
      req.poem.stop();

      // Remove and redirect.
      req.poem.remove(function(err) {
        res.redirect('/admin');
      });

  });

  /*
   * Start poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.getPoem: Pass the poem identified by :slug.
   * @middleware auth.ownsPoem: Pass if the poem belongs to the user.
   */
  app.post('/admin/start/:hash',
    auth.isUser,
    auth.getPoem,
    auth.ownsPoem,
    function(req, res) {

      // Get broadcast callback.
      var emit = scoring.getEmitter(io, req.poem.id);

      // Create starting round, start.
      if (req.poem.unstarted) req.poem.newRound();
      req.poem.start(scoring.execute, emit);

      // Save and redirect.
      req.poem.save(function(err) {
        res.redirect('/admin');
      });

  });

  /*
   * Stop poem.
   *
   * @middleware auth.isUser: Block if there is no user session.
   * @middleware auth.getPoem: Pass the poem identified by :slug.
   * @middleware auth.ownsPoem: Pass if the poem belongs to the user.
   */
  app.post('/admin/stop/:hash',
    auth.isUser,
    auth.getPoem,
    auth.ownsPoem,
    function(req, res) {

      // Stop.
      req.poem.stop();

      // Save and redirect.
      req.poem.save(function(err) {
        res.redirect('/admin');
      });

  });

};
