/*
 * Sockets controller.
 */

// Module dependencies.
var parseCookie = require('connect').utils.parseCookie;
var MongoStore = require('connect-mongodb');
var Session = require('connect').session.Session;

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
      Poem.validateWord(id, word, cb);
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
      Poem.submitWords(id, words, function() {});
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
      Poem.submitVote(id, word, quantity, function() {});
    });

  });

};
