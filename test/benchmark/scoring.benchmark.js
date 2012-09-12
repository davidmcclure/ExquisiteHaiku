/*
 * Performance benchmark for the scoring routine.
 *
 * To run: >> node scoring.benchmark.js {#words} {#votes/word}
 */

// Module dependencies.
var async = require('async');
var _ = require('underscore');

// Boostrap the database.
process.env.NODE_ENV = 'testing';
require('../db-connect');

// User model.
require('../../app/models/user');
var User = mongoose.model('User');

// Poem model.
require('../../app/models/poem');
var Poem = mongoose.model('Poem');

// Round model.
require('../../app/models/round');
var Round = mongoose.model('Round');

// Vote model.
require('../../app/models/vote');
var Vote = mongoose.model('Vote');

// Scoring module.
var scoring = require('../../app/scoring/scoring');

// Create user.
var user = new User({
  username: 'david',
  password: 'password'
});

// Create poem.
var poem = new Poem({
  user: user.id,
  roundLength: 10000,
  sliceInterval: 300,
  minSubmissions: 5,
  submissionVal: 100,
  decayLifetime: 60000,
  seedCapital: 1000,
  visibleWords: 3
});

// Initialize votes tracker.
global.Oversoul = { votes: {} };

// Create round.
var round = poem.newRound();

// Capture timestamp.
var now = Date.now();

// Save.
poem.save(function(err) {

  // Get counters.
  var numWords = process.argv[2];
  var votesPerWord = process.argv[3];

  // Iterate over numWords.
  _.each(_.range(numWords), function(i) {

    // Iterate over votesPerWord.
    _.each(_.range(votesPerWord), function(j) {

      // Create vote.
      var vote = new Vote({
        round: poem.round.id,
        word: 'word'+i,
        quantity: 100,
        applied: now-(1000*i)
      });

      // Register.
      vote.register();

    });

  });

  var t1 = Date.now();
  scoring.score(poem.id, now+1000, function(result) {

    var t2 = Date.now();
    console.log('%d words, %d votes/word', numWords, votesPerWord);
    console.log('Duration: %d', t2-t1);

  }, function() {

    // Truncate poems.
    Poem.collection.remove(function(err) {
      process.exit();
    });

  });

});
