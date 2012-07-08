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
   * @return void.
   */
  Ov.vent.on('words:dragEnd', function() {
    Info.Points.commit();
  });

  return Info;

})(Backbone, Ov);
