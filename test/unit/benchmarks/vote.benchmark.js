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
  quantity: 100
});

// Get iterations and constants.
var i = process.argv[2];
var now = vote.applied.valueOf() + 60000;
var decayLifetime = 60000;
var invDecayLifetime = 1/60000;

var t1 = Date.now();
while (i--) { vote.score(now, decayLifetime, invDecayLifetime); }
var t2 = Date.now();

console.log('Total Duration: %d', t2-t1);
console.log('Average Runtime: %d', (t2-t1)/process.argv[2]);

process.exit();
