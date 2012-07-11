/*
 * Scoring routine.
 */

// Module dependencies.
var _ = require('underscore');

// Poem model.
var Poem = mongoose.model('Poem');


/*
 * Top-level scoring routine.
 *
 * @param {Number} id: The id of the poem to score.
 * @param {Function} emit: The emission callback.
 * @param {Function} cb: The save callback.
 *
 * @return void.
 */
var score = exports.score = function(id, now, emit, cb) {

  // Get poem.
  Poem.findById(id, function(err, poem) {

    var rId = poem.round.id;
    var words = global.Oversoul.votes[rId];
    var stack = [];

    // Get decay lifetime inverse.
    var decayL = poem.decayLifetime;
    var decayI = 1/decayL;

    // Walk words.
    _.each(words, function(votes, word) {

      // Score votes.
      stack.unshift([word, 0, 0]);
      _.each(votes, function(vote) {

        // Score.
        var score = compute(
          vote[0], vote[1], decayL, decayI, now
        );

        // Add. 
        stack[0][1] += score[0];
        stack[0][2] += score[1];

      });

    });

    // Sort stack by rank.
    stack = sort(stack);

    // Truncate to visible words.
    stack = stack.slice(0, poem.visibleWords);

    // Add rank ratios.
    if (!_.isEmpty(stack)) {
      stack = ratios(stack);
    }

    // Check for round expiration.
    if (now > poem.roundExpiration) {

      // Push new word.
      if (!_.isEmpty(stack)) {
        poem.addWord(stack[0][0]);
        poem.markModified('words');
      }

      // If poem is complete, stop.
      if (poem.syllableCount == 17) {
        poem.stop();
      }

      // Otherwise, create new round.
      else {
        poem.newRound();
        stack = [];
      }

    }

    // Emit stacks.
    emit({
      stack: stack,
      syllables: poem.syllableCount,
      round: poem.round.id,
      poem: poem.words,
      clock: poem.timeLeftInRound(now)
    });

    // Save poem.
    poem.save(function(err) {
      cb();
    });

  });

};


/*
 * Compute the rank and churn value of a vote.
 *
 * @param {Number} quantity: The vote quantity.
 * @param {Number} decayL: The decay lifetime.
 * @param {Number} decayI: The decay lifetime inverse.
 * @param {Date} applied: When the vote was applied.
 * @param {Date} now: The current time.
 *
 * @return {Array}: [rank, churn].
 */
var compute = exports.compute = function(
  quantity, applied, decayL, decayI, now) {

  // Compute churn.
  var decay = Math.exp(-(now - applied) * decayI);
  var churn = Math.round(quantity * decay);

  // Compute rank.
  var b1 = quantity * -decayL;
  var b2 = b1 * decay;
  var rank = Math.round(((b2 - b1) * 0.001));

  return [rank, churn];

};


/*
 * Sort the stack by rank.
 *
 * @param {Array} stack: The unsorted stack.
 *
 * @return {Array} stack: The sorted stack.
 */
var sort = exports.sort = function(stack) {
  return stack.sort(function(a,b) {
    return b[1]-a[1];
  });
};


/*
 * Add ratios to stack.
 *
 * @param {Array} stack: The stack.
 *
 * @return {Array} stack: The stack with ratios.
 */
var ratios = exports.ratios = function(stack) {

  // Compute ratios.
  var top = stack[0][1];
  _.each(stack, function(s) {
    s.push((s[1]/top).toFixed(2));
  });

  return stack;

};


/*
 * Call score() with current Date.
 *
 * @param {Number} id: The id of the poem to score.
 * @param {Function} emit: The emission callback.
 * @param {Function} cb: The save callback.
 *
 * @return void.
 */
var execute = exports.execute = function(id, emit, cb) {
  score(id, Date.now(), emit, cb);  
};
