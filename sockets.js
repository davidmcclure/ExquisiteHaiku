/*
 * Sockets runner.
 */

// Module dependencies.
var parseCookie = require('connect').utils.parseCookie;
var MongoStore = require('connect-mongodb');
var Session = require('connect').session.Session;

// Models.
var Poem = mongoose.model('Poem');

module.exports = function(io) {

  io.sockets.on('connection', function (socket) {

    // Connect to poem.
    socket.on('join', function(slug) {
      socket.set('poem', slug, function() {});
      socket.join(slug);
    });

    // Validate word.
    socket.on('validate', function(id, word, cb) {
      Poem.validateWord(id, word, cb);
    });

    // Submit words.
    socket.on('submit', function(id, words) {
      Poem.submitWords(id, words, function() {});
    });

    // Apply word vote.
    socket.on('vote', function(id, word, quantity) {
      Poem.submitVote(id, word, quantity, function() {});
    });

  });

};
