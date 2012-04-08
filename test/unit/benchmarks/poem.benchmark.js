/*
 * Performance benchmark for the Poem score() method.
 *
 * To run: >> node poem.benchmark.js {#words} {#votes/word}
 */

// Module dependencies.
var async = require('async');
var _ = require('underscore');

// Boostrap the database.
process.env.NODE_ENV = 'testing';
require('../db-connect');

// Models.
require('../../../app/models/user');
require('../../../app/models/poem');
require('../../../app/models/round');
require('../../../app/models/vote');
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');
var Round = mongoose.model('Round');
var Vote = mongoose.model('Vote');

// Create user.
var user = new User({
  username: 'david',
  password: 'password',
  email: 'david@test.com',
  active: true
});

// Create poem.
var poem = new Poem({
  slug: 'test-poem',
  user: user.id,
  roundLength : 10000,
  sliceInterval : 3,
  minSubmissions : 5,
  submissionVal : 100,
  decayLifetime : 60000,
  seedCapital : 1000,
  visibleWords : 20
});

// Initialize votes and words global.
global.Oversoul = {
  votes: {},
  words: {}
};

// Create round.
var round = poem.newRound();
global.Oversoul.words[round.id] = {};

// Save.
poem.save(function(err) {

  // Get counters.
  var numWords = process.argv[2];
  var votesPerWord = process.argv[3];

  // Iterate over numWords.
  _.each(_.range(numWords), function(i) {

    // Register word in the tracker.
    global.Oversoul.words['word' + i] = 0;

    // Iterate over votesPerWord.
    _.each(_.range(votesPerWord), function(j) {

      // Create vote.
      global.Oversoul.votes[round.id].push(
          new Vote({
          round: round.id,
          word: 'word' + i,
          quantity: 100
        })
      );

    });

  });

  var t1 = Date.now();
  Poem.score(poem.id, function(result) {

    var t2 = Date.now();
    console.log('Duration: %d', t2-t1);

  }, function() {

    // Truncate poems.
    Poem.collection.remove(function(err) {
      process.exit();
    });

  });

});