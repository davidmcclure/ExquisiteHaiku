/*
 * Socket.io controller.
 */

Ov.Controllers.Socket = (function(Backbone, Ov) {

  var Socket = {};


  // -------
  // Events.
  // -------

  /*
   * Validate a word.
   *
   * @return void.
   */
  Ov.vent.on('socket:validate', function(word, cb) {
    var vcb = function(valid) { cb(valid); };
    Socket.s.emit('validate', Poem._id, word, vcb);
  });


  // ---------------
  // Initialization.
  // ---------------

  Ov.addInitializer(function() {

    Socket.s = io.connect();

    // Connect to poem.
    Socket.s.on('connect', function() {
      Socket.s.emit('join', Poem.slug);
      Ov.vent.trigger('socket:connected');
    });

    // Ingest data slices.
    Socket.s.on('slice', function(data) {
      console.log(data);
      Ov.vent.trigger('socket:slice', data);
    });

  });

  return Socket;

})(Backbone, Ov);
