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
var Word = mongoose.model('Word');
var Vote = mongoose.model('Vote');

// Create round.
var round = new Round();

// Get counters.
var numWords = process.argv[2];
var votesPerWord = process.argv[3];

// Words save queue.
var words = [];

// Create words.
while (numWords--) {

  var word = new Word({
    round: round.id,
    word: 'word' + numWords
  });

  while (votesPerWord--) {
    word.votes.push(new Vote({
      word: word.id,
      quantity: 100
    }));
  }

  // Push word.
  round.words.push(word);

  // Reset counter.
  votesPerWord = process.argv[3];

}

var t1 = Date.now();
var stacks = round.score(Date.now() + 60000, 60000, 10);
var t2 = Date.now();

console.log('Total Duration: %d', t2-t1);

process.exit();
