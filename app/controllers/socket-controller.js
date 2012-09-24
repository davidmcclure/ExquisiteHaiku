/*
 * Sockets controller.
 */

// Module dependencies.
var mongoose = require('mongoose');
var syllables = require('../../lib/syllables');
var async = require('async');
var _ = require('underscore');

// Models.
var Poem = mongoose.model('Poem');
var Vote = mongoose.model('Vote');

module.exports = function(app, io) {

  io.sockets.on('connection', function (socket) {

    /*
     * Connect to a poem room.
     *
     * @param {String} id: The poem id.
     *
     * @return void.
     */
    socket.on('join', function(id) {
      socket.join(id);
      socket.emit('join:complete');
    });

    /*
     * Validate a word.
     *
     * @param {String} id: The id of the poem.
     * @param {String} word: The word.
     * @param {Function} cb: Callback.
     *
     * @return void.
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

    /*
     * Process blind submissions.
     *
     * @param {String} id: The id of the poem.
     * @param {Array} words: The words.
     *
     * @return void.
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

    /*
     * Process vote.
     *
     * @param {String} id: The id of the poem.
     * @param {String} word: The word.
     * @param {Number} quantity: The vote quantity.
     *
     * @return void.
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
