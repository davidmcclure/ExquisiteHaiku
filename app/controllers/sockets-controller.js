/*
 * Sockets controller.
 */

// Module dependencies.
var parseCookie = require('connect').utils.parseCookie;
var MongoStore = require('connect-mongodb');
var Session = require('connect').session.Session;
var syllables = require('../../lib/syllables');
var _ = require('underscore');

// Models.
var Poem = mongoose.model('Poem');

module.exports = function(app, io) {

  io.sockets.on('connection', function (socket) {

    /*
     * Connect to a poem room.
     *
     * @param {String} slug: The poem slug.
     *
     * @return void.
     */
    socket.on('join', function(slug) {
      socket.set('poem', slug, function() {});
      socket.join(slug);
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
        poem.vote(word, quantity);
      });

      socket.get('poem', function(err, slug) {
        io.sockets.in(slug).emit('vote', word, quantity);
      });

    });

  });

};
