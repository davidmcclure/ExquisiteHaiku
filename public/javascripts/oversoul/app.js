/*
 * Application runner.
 */

Ov = new Backbone.Marionette.Application();

Ov.Models =       {};
Ov.Collections =  {};
Ov.Views =        {};
Ov.Controllers =  {};

// Socket.io adapter.
Ov.addInitializer(function() {

  var socket = io.connect();

  // Connect to poem.
  socket.on('connect', function() {
    socket.emit('join', Poem.slug);
    Ov.vent.trigger('socket:connected');
  });

  // Ingest slice.
  socket.on('slice', function(data) {
    console.log(data);
    Ov.vent.trigger('socket:slice', data);
  });

  // Validate word.
  Ov.vent.on('socket:validate', function(word, cb) {
    socket.emit('validate', Poem._id, word, function(valid) {
      cb(valid);
    });
  });

});
