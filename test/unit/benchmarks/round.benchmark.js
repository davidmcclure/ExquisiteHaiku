/*
 * Performance benchmark for the round score() method.
 *
 * To run: >> node round.benchmark.js {#words} {#votes/word}
 */

// Module dependencies.
var async = require('async');
var _ = require('underscore');

// Boostrap the database.
process.env.NODE_ENV = 'testing';
require('../db-connect');

// Models.
require('../../../app/models/round');
var Round = mongoose.model('Round');
var Vote = mongoose.model('Vote');

// Create round.
var round = new Round();

// Get counters.
var numWords = process.argv[2];
var votesPerWord = process.argv[3];

// Votes save queue.
var votes = [];

// Iterate over numWords.
_.each(_.range(numWords), function(i) {

  // Iterate over votesPerWord.
  _.each(_.range(votesPerWord), function(j) {

    // Create vote.
    var vote = new Vote({
      round: round.id,
      word: 'word' + i,
      quantity: 100
    });

    // Push to queue.
    votes.push(vote);

  });

});

// Save worker.
var save = function(document, callback) {
  document.save(function(err) {
    callback(null, document);
  });
};

// Save.
async.map(votes, save, function(err, documents) {

  var t1 = Date.now();
  round.score(Date.now() + 60000, 60000, 50, function(stacks) {

    var t2 = Date.now();
    console.log('Duration: %d', t2-t1);

    // Truncate votes.
    Vote.collection.remove(function(err) {
      process.exit();
    });

  });

});
