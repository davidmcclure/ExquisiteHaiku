/*
 * Performance benchmarking routine for the slicer.
 *
 * To run: >> node slicer.benchmark.js {#words} {#votes / word}
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
require('../../../app/models/word');
require('../../../app/models/vote');
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');
var Round = mongoose.model('Round');
var Word = mongoose.model('Word');
var Vote = mongoose.model('Vote');

// Slicer and words.
var slicer = require('../../../lib/slicer');
var words = require('../../../lib/syllables');

// Capture arguments.
var numWords = process.argv[2];
var votesPerWord = process.argv[3];


/*
 * --------
 * Helpers.
 * --------
 */


// Get random word.
var randWord = function(obj) {
  var result; var count = 0;
  _.each(words.syllables, function(syll, word) {
    if (Math.random() < 1/++count) result = word;
  });
  return result;
};

// Get random integer.
var randInt = function(min, max) {
  return Math.floor(Math.random() * (max-min+1)) + min;
};


/*
 * ------------------
 * Scoring benchmark.
 * ------------------
 */


// Create user.
var user = new User({
  username: 'david',
  password: 'password',
  email: 'david@test.com',
  admin: true
});

// Create poem.
var poem = new Poem({
  slug: 'test-poem',
  user: user.id,
  roundLength : 10000,
  sliceInterval : 3,
  minSubmissions : 5,
  submissionVal : 100,
  decayLifetime : 50000,
  seedCapital : 1000,
  visibleWords : 50
});

// Create round.
round = new Round({
  poem: poem.id,
  started: Date.now() - 100000001
});

// Save worker.
var save = function(document, callback) {
  document.save(function(err) {
    callback(null, document);
  });
};

// Save.
async.map([
  user,
  poem,
  round
], save, function(err, documents) {

  // Save queue array.
  var docs = [];

  // Create words.
  _.each(_.range(numWords), function() {

    // Create word document using a random word.
    var word = new Word({
      round: round.id,
      word: randWord()
    });

    // Push onto queue.
    docs.push(word);

    // Create votes.
    _.each(_.range(votesPerWord), function() {

      // Create vote document, with quantity varying randomly
      // between 1 and 1000 and the time delta varying randomly
      // between now and now - 100,000 seconds.
      var vote = new Vote({
        word: word.id,
        quantity: randInt(1,1000),
        applied: Date.now() - randInt(0,100000000)
      });

      // Push onto queue.
      docs.push(vote);

    });

  });

  // Save words and votes.
  async.map(docs, save, function(err, documents) {

    // Capture starting timestamp.
    var t1 = Date.now();

    var stacks = slicer.integrator(poem, function(stacks) {

      // Capture ending timestamp.
      var t2 = Date.now();
      console.log('Duration: %d', t2-t1);
      console.log(stacks);

      // Truncate worker.
      var remove = function(model, callback) {
        model.collection.remove(function(err) {
          callback(err, model);
        });
      };

      // Truncate.
      async.map([
        User,
        Poem,
        Round,
        Word,
        Vote
      ], remove, function(err, models) {
        process.exit();
      });

    });

  });

});
