/*
 * Performance benchmark for the vote score() method.
 *
 * To run: >> node word.benchmark.js {#votes}
 */

// Module dependencies.
var async = require('async');

// Boostrap the database.
process.env.NODE_ENV = 'testing';
require('../db-connect');

// Models.
require('../../../app/models/word');
var Word = mongoose.model('Word');
var Vote = mongoose.model('Vote');

// Create word.
var word = new Word({
  word: 'test'
});

// Get iterations.
var i = process.argv[2];

// Create votes.
while (i--) {
  word.votes.push(new Vote({
    word: word.id,
    quantity: 100
  }));
}

// Save votes.
word.save(function(err) {

  var t1 = Date.now();
  var score = word.score(Date.now() + 60000, 60000);
  var t2 = Date.now();

  console.log(score);
  console.log('Total Duration: %d', t2-t1);

  // Clear votes.
  Vote.collection.remove(function(err) {
    process.exit();
  });

});
