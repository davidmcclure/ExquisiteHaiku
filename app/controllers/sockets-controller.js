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

      // Store id, join room.
      socket.set('poem', id, function() {});
      socket.join(id);

      // Increment player count, emit new value.
      var count = ++global.Oversoul.playerCounts[id];
      io.sockets.in(id).emit('playerCount', count);

      // Emit vote count.
      io.sockets.in(id).emit('voteCount',
        global.Oversoul.voteCounts[id]);

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

        });

        // Increment vote count, emit new value.
        global.Oversoul.voteCounts[id] += words.length;
        io.sockets.in(id).emit('voteCount', 
          global.Oversoul.voteCounts[id]);

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
      io.sockets.in(id).emit('vote', word, quantity);

      // Increment vote count, emit new value.
      var count = ++global.Oversoul.voteCounts[id];
      io.sockets.in(id).emit('voteCount', count);

    });

    /*
     * Deincrement player count.
     *
     * @return void.
     */
    socket.on('disconnect', function() {

      // Deincrement player count, emit new value.
      socket.get('poem', function(err, id) {
        var count = --global.Oversoul.playerCounts[id];
        io.sockets.in(id).emit('playerCount', count);
      });

    });

  });

};
