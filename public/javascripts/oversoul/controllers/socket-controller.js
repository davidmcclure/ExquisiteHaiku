/*
 * Socket.io controller.
 */

Ov.Controllers.Socket = (function(Backbone, Ov) {

  var Socket = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate Socket.io and connect to the room.
   *
   * @return void.
   */
  Ov.addInitializer(function() {

    Socket.s = io.connect();

    // Connect to poem.
    Socket.s.on('connect', function() {
      Socket.s.emit('join', Poem.slug);
      Ov.vent.trigger('socket:connected');
    });

    // Ingest data slices.
    Socket.s.on('slice', function(data) {
      Ov.vent.trigger('socket:slice', data);
    });

  });


  // -------
  // Events.
  // -------

  /*
   * Validate a word.
   *
   * @param {String} word: The word.
   * @param {Function} cb: Callback.
   *
   * @return void.
   */
  Ov.vent.on('socket:validate', function(word, cb) {
    var vcb = function(valid) { cb(valid); };
    Socket.s.emit('validate', Poem._id, word, vcb);
  });

  /*
   * Save blind submissions.
   *
   * @param {Array} words: The words.
   * @param {Function} cb: Callback.
   *
   * @return void.
   */
  Ov.vent.on('socket:submit', function(words, cb) {
    Socket.s.emit('submit', Poem._id, words);
  });

  /*
   * Save vote.
   *
   * @param {String} word: The word.
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
   */
  Ov.vent.on('socket:vote', function(word, quantity) {
    Socket.s.emit('vote', Poem._id, word, quantity);
  });

  return Socket;

})(Backbone, Ov);
