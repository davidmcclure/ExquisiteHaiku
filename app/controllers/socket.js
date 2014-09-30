
/**
 * Sockets controller.
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var syllables = require('../../lib/syllables');
var async = require('async');
var Poem = mongoose.model('Poem');
var Vote = mongoose.model('Vote');


module.exports = function(app, io) {

  io.sockets.on('connection', function (socket) {

    console.log(socket.id);

    /**
     * Connect to a poem room.
     *
     * @param {String} id: The poem id.
     */
    socket.on('join', function(id) {
      socket.join(id);
      socket.emit('join:complete');
    });

    /**
     * Validate a word.
     *
     * @param {String} id: The id of the poem.
     * @param {String} word: The word.
     * @param {Function} cb: Callback.
     */
    socket.on('validate', function(id, word, cb) {

      // Is the word a valid word?
      if (!_.has(syllables, word)) {
        cb(false);
      }

      else {

        // Does the word fit?
        Poem.findById(id, function(err, poem) {
          if (!poem.addWord(word)) cb(false);
          else cb(true);
        });

      }

    });

    /**
     * Process blind submissions.
     *
     * @param {String} id: The id of the poem.
     * @param {Array} words: The words.
     */
    socket.on('submit', function(id, words) {

      // Get the poem.
      Poem.findById(id, function(err, poem) {

        // Votes array.
        var votes = [];

        // Walk the words.
        _.each(words, function(word) {

          // Create the vote.
          votes.push(new Vote({
            round: poem.round.id,
            quantity: poem.submissionVal,
            word: word
          }));

        });

        // Save worker.
        var save = function(vote, cb) {

          // Save the vote.
          vote.save(function(err) {

            // Echo the vote.
            io.sockets.in(id).emit('vote',
              vote.word, vote.quantity);

            // Continue.
            cb(null, vote);

          });

        };

        // Execute save, notify completion.
        async.map(votes, save, function (err, votes) {
          socket.emit('submit:complete');
        });

      });

    });

    /**
     * Process vote.
     *
     * @param {String} id: The id of the poem.
     * @param {String} word: The word.
     * @param {Number} quantity: The vote quantity.
     */
    socket.on('vote', function(id, word, quantity) {

      // Get the poem.
      Poem.findById(id, function(err, poem) {

        // Create the vote.
        var vote = new Vote({
          round: poem.round.id,
          word: word,
          quantity: quantity
        });

        // Save.
        vote.save(function(err) {

          // Echo the vote.
          io.sockets.in(id).emit('vote',
            word, quantity);

          // Notify completion.
          socket.emit('vote:complete');

        });

      });

    });

  });

};
