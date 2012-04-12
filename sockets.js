/*
 * Sockets runner.
 */

// Start-up routine.
module.exports = function(io) {

  io.sockets.on('connection', function (socket) {

    socket.on('join poem', function(slug) {
      socket.set('poem', slug, function() {});
      socket.join(slug);
    });

    setInterval(function() {
      io.sockets.in('testslug').emit('slice', {
        slice: 'data'
      });
    }, 500);

  });

}
