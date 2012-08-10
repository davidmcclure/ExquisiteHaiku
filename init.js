/*
 * Startup.
 */

// Module dependencies.
var scoring = require('./app/scoring/scoring');
var _ = require('underscore');

// Models.
var Poem = mongoose.model('Poem');
var Vote = mongoose.model('Vote');


/*
 * Top-level startup routine.
 *
 * @param {Object} app: The node server.
 * @param {Object} io: The socket.io server.
 * @param {Object} config: The configuration object.
 *
 * @return void.
 */
var run = exports.run = function(app, io, config) {

  // In-memory stores.
  global.Oversoul = { timers: {}, votes: {} };

  // Set application constants.
  app.set('sliceInterval', config.sliceInterval);
  app.set('visibleWords', config.visibleWords);

  // Start poems.
  startPoems(io);

};


/*
 * Restart all running poems.
 *
 * @param {Object} io: The socket.io server.
 *
 * @return void.
 */
var startPoems = exports.startPoems = function(io) {

  // Get running poems.
  Poem.find({
    running: true
  }, function(err, poems) {

    // Walk poems.
    _.each(poems, function(poem) {

      // Get votes.
      Vote.find({
        round: poem.round.id
      }, function(err, votes) {

        // Register round.
        poem.round.register();

        // Register votes.
        _.each(votes, function(vote) {
          vote.register();
        });

        // Start poem.
        var emit = scoring.getEmitter(io, poem.id);
        poem.start(scoring.execute, emit, function() {});

      });

    });

  });

};
