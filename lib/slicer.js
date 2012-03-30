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

  // Get all rounds for poem.
  Round.find({ poem: poem.id }).
    sort('started', -1).execFind(function(err, rounds) {

    // Current round is the most recent.
    var currentRound = _.first(rounds);

    // Get all words for the round.
    Word.find({ round: currentRound.id }, function(err, words) {

      _.each(words, function(word) {

        // Get all votes for the word.
        Vote.find({ word: word.id }, function(err, votes) {

          _.each(votes, function(vote) {
            console.log(vote);
          });

        });

      });

    });

  });

};
