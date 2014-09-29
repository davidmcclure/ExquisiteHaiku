
/**
 * Startup.
 */

var scoring = require('../app/scoring/scoring');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');

// Models.
var Poem = mongoose.model('Poem');
var Vote = mongoose.model('Vote');


/**
 * Create memory stores for votes and timers, restart
 * running poems.
 *
 * @param {Object} app: The node server.
 * @param {Object} io: The socket.io server.
 * @param {Function} cb: Callback.
 */
module.exports = function(app, io, cb) {
  cb = cb || function() {};

  // Get running poems.
  Poem.find({
    running: true
  }, function(err, poems) {

    // Walk poems async.
    async.map(poems, function(poem, callback) {

      // Get votes for current round.
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

        if (process.env.NODE_ENV != 'testing')
          console.log('Started %s', poem.hash);

        // Continue.
        callback(null, poem);

      });

    }, function(err, poems) { cb(); });

  });

};
