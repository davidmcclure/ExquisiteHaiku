/*
 * Sockets controller.
 */

// Module dependencies.
var syllables = require('../../lib/syllables');
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

        // Walk the words.
        _.each(words, function(word) {

          // Create the vote.
          var vote = new Vote({
            round: poem.round.id,
            word: word,
            quantity: poem.submissionVal
          });

          // Save.
          vote.save(function(err) {});

          // Echo the vote.
          io.sockets.in(id).emit('vote',
            word, poem.submissionVal
          );

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
        vote.save(function(err) {});

      });

      // Echo the vote.
      io.sockets.in(id).emit('vote',
        word, quantity
      );

    });

  });

};
