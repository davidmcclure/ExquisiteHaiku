
/**
 * Configure the Socket.io instance.
 */

var cookie = require('cookie');
var parser = require('cookie-parser');


module.exports = function(io) {

  io.set('authorization', function(data, accept) {

    // Block if no session.
    if (!data.headers.cookie) {
      accept('Session cookie required.', false);
    }

    // Parse the cookie and set the value.
    var cookies = cookie.parse(data.headers.cookie);
    cookies = parser.signedCookies(cookies, process.env.EH_SECRET);
    data.sid = cookies['connect.sid'];

    accept(null, true);

  });

};
