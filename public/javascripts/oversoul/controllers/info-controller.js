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
  Ov.addInitializer(function() {
    Info.Points = new Ov.Views.Points();
    Info.Timer = new Ov.Views.Timer();
  });


  // -------
  // Events.
  // -------

  /*
   * Reset the point value.
   *
   * @return void.
   */
  Ov.vent.on('state:submit', function(round) {
    Info.Points.activateSubmit();
  });

  /*
   * Initialize the point value.
   *
   * @param {Object} round: The round record.
   *
   * @return void.
   */
  Ov.vent.on('state:vote', function(round) {
    Info.Points.activateVote(round);
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
   * Commit new point account value after a vote.
   *
   * @param {Object} word: The stack word view instance.
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
   */
  Ov.vent.on('words:dragCommit', function(word, quantity) {
    Info.Points.commit(word, quantity);
  });

  return Info;

})(Backbone, Ov);
