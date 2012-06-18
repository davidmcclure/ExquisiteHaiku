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
// while (i--) { vote.score(t, d, id); }
// while (i--) { score(t, d, id, vote.applied, vote.quantity); }
var test = [1339991346551, 300];
for(var j=0; j<i; j++) {
  score(t, d, id, test[0], test[1]);
}
var t2 = Date.now();

console.log('%d votes', process.argv[2]);
console.log('Duration: %d', t2-t1);

process.exit();



function score(now, decayL, decayI, applied, quantity) {

  // Get time delta.
  var delta = now - applied;

  // Compute unscaled decay coefficient.
  var decay = Math.exp(-delta * decayI);

  // Compute churn.
  var churn = Math.round(quantity * decay);

  // Starting boundaries.
  var bound1 = quantity * -decayL;
  var bound2 = bound1 * decay;

  // Get the integral, scale and round.
  var rank = Math.round(((bound2-bound1)*0.001));

  return { rank: rank, churn: churn };

}
