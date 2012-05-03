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

  });

};
