
/**
 * Info controller.
 */

Ov.Controllers.Info = (function(Backbone, Ov) {

  var Info = {};


  // ---------------
  // Initialization.
  // ---------------

  /**
   * Instantiate timer and points.
   */
  Info.init = function() {
    Info.Points = new Ov.Views.Points({ el: '#points' });
    Info.Timer = new Ov.Views.Timer({ el: '#timer' });
  };


  // -------
  // Events.
  // -------

  /**
   * Update the clock.
   *
   * @param {Object} data: The incoming data packet.
   */
  Ov.vent.on('socket:slice', function(data) {
    Info.Timer.update(data.clock);
  });

  /**
   * Initialize the point value.
   *
   * @param {Object} round: The round record.
   */
  Ov.vent.on('state:newRound', function(round) {
    Info.Points.setPoints(round.get('points'));
  });

  /**
   * Render preview point value.
   *
   * @param {String} word: The word being dragged on.
   * @param {Number} currenTotal: The current drag quantity.
   * @param {Object} initEvent: The initiating click event.
   * @param {Object} dragEvent: The current mousemove event.
   */
  Ov.vent.on('words:dragTick', function(
    word, currentTotal, initEvent, dragEvent) {
      Info.Points.setPreview(currentTotal);
  });

  /**
   * Commit new point account value after a vote.
   *
   * @param {Number} value: The new account balance.
   */
  Ov.vent.on('points:newValue', function(value) {
    Info.Points.setPoints(value);
  });

  /**
   * Render preview point value.
   *
   * @param {String} word: The word.
   * @param {Number} quantity: The vote quantity.
   */
  Ov.vent.on('log:preview', function(word, quantity) {
    Info.Points.setPreview(quantity);
  });

  /**
   * Commit a vote echo action on the log stack.
   *
   * @param {String} word: The word.
   * @param {Number} quantity: The vote quantity.
   */
  Ov.vent.on('log:echo', function(word, quantity) {
    Info.Points.releaseLogEcho(word, quantity);
  });

  /**
   * Cancel a point preview on drag cancel.
   */
  Ov.vent.on('words:dragCancel', function() {
    Info.Points.reset();
  });

  /**
   * Cancel a point preview on mouseleave log word.
   */
  Ov.vent.on('log:cancel', function() {
    Info.Points.reset();
  });


  // Export.
  Ov.addInitializer(function() { Info.init(); });
  return Info;

})(Backbone, Ov);
