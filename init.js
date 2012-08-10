/*
 * Startup.
 */

// Module dependencies.
var scoring = require('./app/scoring/scoring');
var async = require('async');
var _ = require('underscore');

// Models.
var Poem = mongoose.model('Poem');
var Vote = mongoose.model('Vote');


/*
 * Top-level startup routine.
 *
 * @param {Object} app: The node server.
 * @param {Object} config: The configuration object.
 * @param {Object} io: The socket.io server.
 *
 * @return void.
 */
var run = exports.run = function(app, config, io) {

  // In-memory stores.
  global.Oversoul = { timers: {}, votes: {} };

  // Set application constants.
  app.set('sliceInterval', config.sliceInterval);
  app.set('visibleWords', config.visibleWords);

  // Start poems.
  exports.startPoems(io, function() {});

};


/*
 * Restart all running poems.
 *
 * @param {Object} io: The socket.io server.
 * @param {Funciton} cb: Callback.
 *
 * @return void.
 */
var startPoems = exports.startPoems = function(io, cb) {

  // Get running poems.
  Poem.find({ running: true }, function(err, poems) {

    // Walk poems async.
    async.map(poems, function(poem, callback) {

      // Get votes for current round.
      Vote.find({ round: poem.round.id }, function(err, votes) {

        // Register round.
        poem.round.register();

        // Register votes.
        _.each(votes, function(vote) {
          vote.register();
        });

        // Start poem.
        var emit = scoring.getEmitter(io, poem.id);
        poem.start(scoring.execute, emit, function() {});

        // Continue.
        callback(null, poem);

      });

    }, function(err, poems) { cb(); });

  });

};
