/*
 * Socket.io controller.
 */

Ov.Controllers.Socket = (function(Backbone, Ov) {

  var Socket = {};

  /*
   * Connect Socket.io.
   *
   * @return void.
   */
  Socket.init = function() {

    Socket.s = io.connect();

    // ----------------
    // Incoming events.
    // ----------------

    /*
     * Request connection to poem.
     *
     * @return void.
     */
    Socket.s.on('connect', function() {
      Socket.s.emit('join', P._id);
    });

    /*
     * When connected to poem.
     *
     * @return void.
     */
    Socket.s.on('join:complete', function() {
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

  };


  // ----------------
  // Outgoing events.
  // ----------------

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
    Socket.s.emit('validate', P._id, word, vcb);
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
    Socket.s.emit('submit', P._id, words);
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
    Socket.s.emit('vote', P._id, word, quantity);
  });


  // Export.
  Ov.addInitializer(function() { Socket.init(); });
  return Socket;

})(Backbone, Ov);
