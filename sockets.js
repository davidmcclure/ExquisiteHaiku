/*
 * Sockets runner.
 */

// Module dependencies.
var parseCookie = require('connect').utils.parseCookie;

// Start-up routine.
module.exports = function(io) {

  // ** dev
  io.set('authorization', function(data, accept) {

    if (data.headers.cookie) {

      // Read cookie and set session id.
      data.cookie = parseCookie(data.headers.cookie);
      data.sessionId = data.cookie['connect.sid'];
    }

    else {
      return accept('No cookie transmitted.', false);
    }

    accept(null, true);

  });

  // On socket connection.
  io.sockets.on('connection', function (socket) {

    // ** dev
    // On 'join poem' event, set poem.
    socket.on('join poem', function(slug) {
      socket.set('poem', slug, function() {});
      socket.join(slug);
    });

  });

};
