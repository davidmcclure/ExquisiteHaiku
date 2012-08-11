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

    /*
     * Request connection to poem.
     *
     * @return void.
     */
    Socket.s.on('connect', function() {
      Socket.s.emit('join', Poem._id);
    });

    /*
     * When connected to poem.
     *
     * @return void.
     */
    Socket.s.on('join', function() {
      Ov.vent.trigger('socket:connected');
    });

    /*
     * Ingest scoring data.
     *
     * @param {Object} data: The data slice.
     *
     * @return void.
     */
    Socket.s.on('slice', function(data) {
      Ov.vent.trigger('socket:slice', data);
    });

    /*
     * Propagate vote.
     *
     * @param {String} word: The word.
     * @param {Number} quantity: The vote quantity.
     *
     * @return void.
     */
    Socket.s.on('vote', function(word, quantity) {
      Ov.vent.trigger('socket:vote:in', word, quantity);
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
  Ov.vent.on('blank:validate', function(word, cb) {
    var vcb = function(valid) { cb(valid); };
    Socket.s.emit('validate', Poem._id, word, vcb);
  });

  /*
   * Commit submissions.
   *
   * @param {Array} words: The words.
   * @param {Function} cb: Callback.
   *
   * @return void.
   */
  Ov.vent.on('blank:submit', function(words, cb) {
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
  Ov.vent.on('points:releaseVote', function(word, quantity) {
    Socket.s.emit('vote', Poem._id, word, quantity);
  });

  return Socket;

})(Backbone, Ov);
