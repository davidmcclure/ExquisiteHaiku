/*
 * Scoring routine.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
var Poem = mongoose.model('Poem');
var Round = mongoose.model('Round');
var Word = mongoose.model('Word');
var Vote = mongoose.model('Vote');

exports.integrator = function(poem) {

  var rank = []; var churn = [];
  var now = Date.now();

  // Get all rounds for poem.
  Round.find({ poem: poem.id }).
    sort('started', -1).execFind(function(err, rounds) {

    // Current round is the most recent.
    var currentRound = _.first(rounds);

    // Get all words for the round.
    Word.find({ round: currentRound.id }, function(err, words) {

      _.each(words, function(word) {

        var rank = 0; var churn = 0;

        // Get all votes for the word.
        Vote.find({ word: word.id }, function(err, votes) {

          _.each(votes, function(vote) {

            // Get time delta.
            var delta = now - vote.applied;

            // Compute churn.
            var voteChurn = vote.quantity * Math.pow(
              Math.E, (-delta / poem.decayLifetime)
            );

            // Starting boundary.
            var bound1 = vote.quantity * -poem.decayLifetime * Math.pow(
              Math.E, 0
            );

            // Current boundary.
            var bound2 = vote.quantity * -poem.decayLifetime * Math.pow(
              Math.E, (-delta / poem.decayLifetime)
            );

            // Increment word counters.
            rank += (bound2 - bound1);
            churn += voteChurn;

          });

          // Push word onto stacks.
          rank.push([word.word], rank);
          churn.push([word.word], churn);

          // Sort comparer.
          var comp = function(a,b) { return b[1]-a[1]; };

          // Sort the stacks.
          rank = rank.sort(comp).slice(0, poem.visibleWords);
          churn = churn.sort(comp).slice(0, poem.visibleWords);

          return [rank, churn];

        });

      });

    });

  });

};
