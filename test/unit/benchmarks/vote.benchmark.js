/*
 * Performance benchmark for the vote score() method.
 *
 * To run: >> node vote.benchmark.js {#executions}
 */

// Boostrap the database.
process.env.NODE_ENV = 'testing';
require('../db-connect');

// Models.
require('../../../app/models/vote');
var Vote = mongoose.model('Vote');

// Create vote.
var vote = new Vote({
  word: 'word',
  quantity: 100
});

// Get iterations and constants.
var i = process.argv[2];

// Get calling constants.
var t = vote.applied.valueOf() + 60000;
var d = 60000;
var id = 1/d;

var t1 = Date.now();
while (i--) { vote.score(t, d, id); }
var t2 = Date.now();

console.log('%d votes', process.argv[2]);
console.log('Duration: %d', t2-t1);

process.exit();
