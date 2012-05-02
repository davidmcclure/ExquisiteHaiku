/*
 * Application runner.
 */

Oversoul = new Backbone.Marionette.Application();

// Socket.io adapter.
Oversoul.addInitializer(function() {

  var socket = io.connect();

  // Connect to poem.
  socket.on('connect', function() {
    socket.emit('join', Poem.slug);
    Oversoul.vent.trigger('socket:connected');
  });

  // Ingest slice.
  socket.on('slice', function(data) {
    console.log(data);
    Oversoul.vent.trigger('socket:slice', data);
  });

});
