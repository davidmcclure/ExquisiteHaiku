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
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');
var Round = mongoose.model('Round');

// Create user.
var user = new User({
  username: 'david',
  password: 'password',
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

// Initialize votes tracker.
global.Oversoul = { votes: {} };

// Create round.
var round = poem.newRound();

// Save.
poem.save(function(err) {

  // Get counters.
  var numWords = process.argv[2];
  var votesPerWord = process.argv[3];

  // Iterate over numWords.
  _.each(_.range(numWords), function(i) {

    // Iterate over votesPerWord.
    _.each(_.range(votesPerWord), function(j) {
      poem.vote('word'+i, 100);
    });

  });

  var t1 = Date.now();
  Poem.score(poem.id, Date.now(), function(result) {

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
