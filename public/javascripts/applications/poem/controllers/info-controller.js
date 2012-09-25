/*
 * Info controller.
 */

Ov.Controllers.Info = (function(Backbone, Ov) {

  var Info = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate timer and points.
   *
   * @return void.
   */
  Info.init = function() {
    Info.Points = new Ov.Views.Points({ el: '#points' });
    Info.Timer = new Ov.Views.Timer({ el: '#timer' });
  };


  // -------
  // Events.
  // -------

  /*
   * Update the clock.
   *
   * @param {Object} data: The incoming data packet.
   *
   * @return void.
   */
  Ov.vent.on('socket:slice', function(data) {
    Info.Timer.update(data.clock);
  });

  /*
   * Initialize the point value.
   *
   * @param {Object} round: The round record.
   *
   * @return void.
   */
  Ov.vent.on('state:newRound', function(round) {
    Info.Points.renderValue(round.get('points'));
  });

  /*
   * Render preview point value.
   *
   * @param {String} word: The word being dragged on.
   * @param {Number} currenTotal: The current drag quantity.
   * @param {Object} initEvent: The initiating click event.
   * @param {Object} dragEvent: The current mousemove event.
   *
   * @return void.
   */
  Ov.vent.on('words:dragTick', function(
    word, currentTotal, initEvent, dragEvent) {
      Info.Points.renderPreview(currentTotal);
  });

  /*
   * Cancel a point preview on drag cancel.
   *
   * @return void.
   */
  Ov.vent.on('words:dragCancel', function() {
    Info.Points.reset();
  });

  /*
   * Cancel a point preview on mouseleave log word.
   *
   * @return void.
   */
  Ov.vent.on('log:cancel', function() {
    Info.Points.reset();
  });

  /*
   * Commit new point account value after a vote.
   *
   * @param {String} word: The word.
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
   */
  Ov.vent.on('words:dragCommit', function(word, quantity) {
    Info.Points.releaseStackVote(word, quantity);
  });

  /*
   * Render preview point value.
   *
   * @param {String} word: The word.
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
   */
  Ov.vent.on('log:preview', function(word, quantity) {
    Info.Points.renderPreview(quantity);
  });

  /*
   * Commit a vote echo action on the log stack.
   *
   * @param {String} word: The word.
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
   */
  Ov.vent.on('log:echo', function(word, quantity) {
    Info.Points.releaseLogEcho(word, quantity);
  });


  // Export.
  Ov.addInitializer(function() { Info.init(); });
  return Info;

})(Backbone, Ov);
