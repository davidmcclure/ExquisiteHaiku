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
require('../../../app/models/vote');
var Word = mongoose.model('Word');
var Vote = mongoose.model('Vote');

// Create word.
var word = new Word({
  word: 'test'
});

// Get iterations.
var i = process.argv[2];

// Save queue for votes.
var votes = [];

// Create votes.
while (i--) {
  votes.push(new Vote({
    word: word.id,
    quantity: 100
  }));
}

// Save worker.
var save = function(document, callback) {
  document.save(function(err) {
    callback(null, document);
  });
};

// Save votes.
async.map(votes, save, function(err, documents) {

  var t1 = Date.now();
  word.score(Date.now() + 60000, 60000, function(score) {

    var t2 = Date.now();
    console.log(score);
    console.log('Total Duration: %d', t2-t1);

    // Clear votes.
    Vote.collection.remove(function(err) {
      process.exit();
    });

  });

});
