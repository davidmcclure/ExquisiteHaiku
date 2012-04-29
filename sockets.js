/*
 * Sockets runner.
 */

// Module dependencies.
var parseCookie = require('connect').utils.parseCookie;
var MongoStore = require('connect-mongodb');
var Session = require('connect').session.Session;

module.exports = function(io, store) {

  // Session authorization.
  io.set('authorization', function(data, accept) {

    // If a cookie exists.
    if (data.headers.cookie) {

      // Read cookie and set session id.
      data.cookie = parseCookie(data.headers.cookie);
      data.sessionId = data.cookie['connect.sid'];

      // Save session store.
      data.sessionStore = store;

      // Try to get session.
      store.get(data.sessionId, function(err, session) {

        // If no session, throw.
        if (err || !session) {
          accept('Error', false);
        }

        // Create new session.
        else {
          data.session = new Session(data, session);
          accept(null, true);
        }

      });

    }

    else {
      return accept('No cookie transmitted.', false);
    }

  });


  /*
   * --------
   * Actions.
   * --------
   */


  io.sockets.on('connection', function (socket) {

    // Connect to poem.
    socket.on('join', function(slug) {
      socket.set('poem', slug, function() {});
      socket.join(slug);
    });

    // Validate word.
    socket.on('validate', function(word) {

    });

  });

};
