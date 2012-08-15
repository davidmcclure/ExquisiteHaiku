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

    // Capture round id and words.
    var rId = poem.round.id;
    var words = global.Oversoul.votes[rId];

    // The stack array, sorted by rank:
    // [word, rank, +churn, -churn, ratio]
    var stack = [];

    // Get decay lifetime inverse.
    var decayL = poem.decayLifetime;
    var decayI = 1/decayL;

    // Walk words.
    _.each(words, function(votes, word) {

      // Score votes.
      stack.unshift([word, 0, 0, 0]);
      _.each(votes, function(vote) {

        // Score.
        var score = compute(
          vote[0], vote[1], decayL, decayI, now);

        // Merge vote.
        merge(stack, score);

      });

    });

    // Sort stack by rank.
    stack = sort(stack);

    // Round rank and churn parts.
    stack = round(stack);

    // Truncate to visible words.
    stack = stack.slice(0, poem.visibleWords);

    // Add rank ratios.
    if (!_.isEmpty(stack)) stack = ratios(stack);

    // If the round is expired.
    if (now > poem.roundExpiration) {

      // Add winning word to poem.
      if (!_.isEmpty(stack)) {
        poem.addWord(stack[0][0]);
        poem.markModified('words');
      }

      // If poem is complete, stop.
      if (poem.syllableCount == 17) poem.stop();

      // Otherwise, create new round.
      else { poem.newRound(); stack = []; }

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
    poem.save(function(err) { cb(); });

  });

};


/*
 * Compute the rank and churn values of a vote.
 *
 * @param {Number} quantity: The vote quantity.
 * @param {Date} applied: When the vote was applied.
 * @param {Number} decayL: The decay lifetime.
 * @param {Number} decayI: The decay lifetime inverse.
 * @param {Date} now: The current time.
 *
 * @return {Array}: [rank, churn].
 */
var compute = exports.compute = function(
  quantity, applied, decayL, decayI, now) {

  // Compute churn.
  var decay = Math.exp(-(now - applied) * decayI);
  var churn = quantity * decay;

  // Compute rank.
  var b1 = quantity * -decayL;
  var b2 = b1 * decay;
  var rank = ((b2 - b1) * 0.001);

  return [rank, churn];

  /*
  Quixote and the Stone

  In the right light you can see that from my ears
  Issue into the world two great arcs of joy and mourn
  Curving widely and slowly into the sky
  Straining towards identity across the loop.

  My steed bore me to the grasses of a small meadow,
  High in the plains, where I discovered a stone.
  I divined it to be a crumb lost from the howling tables
  Of all the scuttling and wonderful monsters
  Who keep me company through the night,
  And resolved, as was my wont, to unmake its plight.

  I thrust my sword into the soil
  And set the pebble atop the skyward crown of the hilt
  And conjured swirling and singing winds
  In the world behind my eyes
  And bestowed on my little ward
  A license and duty to make haste to heaven.

  I tore out my beard and found myself covered in blood
  And crosslegged in the grass
  And leaned backwards into a long nap.
  When I woke it was night,
  And Rocinante was nibbling on mushrooms,
  And was glad to see me.

  I recovered the stone, which I had cast back down,
  And passed the night under the bright Spanish stars
  Grinding it to a dust under the spur of my boot.
  At dawn I pinched the little mound in my fingers
  And threw it into the wind.
  */

};


/*
 * Merge new vote score into stack.
 *
 * @param {Array} stack: The stack.
 * @param {Array} score: [rank, churn] for vote.
 *
 * @return {Array} stack: The updated stack.
 */
var merge = exports.merge = function(stack, score) {

  // Add rank.
  stack[0][1] += score[0];

  // Add churn.
  if (score[1] > 0) stack[0][2] += score[1];
  else stack[0][3] += score[1];

  return stack;

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
 * Round the rank and churn values.
 *
 * @param {Array} stack: The stack.
 *
 * @return {Array} stack: The rounded stack.
 */
var round = exports.round = function(stack) {

  // Round rank, +churn, -churn.
  return _.map(stack, function(word) {
    return [
      word[0],
      Math.round(word[1]),
      Math.round(word[2]),
      Math.round(word[3])
    ];
  });

};


/*
 * Generate the data slice emitter.
 *
 * @param {Object} io: The socket.io server.
 * @param {String} id: The poem id.
 *
 * @return void.
 */
var getEmitter = exports.getEmitter = function(io, id) {
  return function(result) {
    io.sockets.in(id).emit('slice', result);
  };
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
