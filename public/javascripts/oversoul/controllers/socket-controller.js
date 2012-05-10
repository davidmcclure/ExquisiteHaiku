/*
 * Socket.io controller.
 */

Ov.Controllers.Socket = (function(Backbone, Ov) {

  var Socket = {};


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

    // Hit Poem.validateWord() on the server.
    var vcb = function(valid) { cb(valid); };
    Socket.s.emit('validate', Poem._id, word, vcb);

  });

  /*
   * Submit words.
   *
   * @param {Array} words: The words.
   * @param {Function} cb: Callback.
   *
   * @return void.
   */
  Ov.vent.on('socket:submit', function(words, cb) {

    // Save submissions.
    Socket.s.emit('submit', Poem._id, words);

  });

  /*
   * Commit allocation.
   *
   * @param {String} word: The word.
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
   */
  Ov.vent.on('socket:vote', function(word, quantity) {

    // Save submissions.
    Socket.s.emit('vote', Poem._id, word, quantity);

  });

  return Socket;

})(Backbone, Ov);
