
/**
 * Configure the Socket.io instance.
 */

var parser = require('cookie-parser');


module.exports = function(io) {

  io.set('authorization', function(data, accept) {

    // Block if no session.
    if (!data.headers.cookie) {
      accept('Session cookie required.', false);
    }

    accept(null, true);

  });

};
