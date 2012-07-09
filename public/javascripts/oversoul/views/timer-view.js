/*
 * Timer view.
 */

Ov.Views.Timer = Backbone.View.extend({

  el: '#timer',

  /*
   * .
   *
   * @return void.
   */
  initialize: function() {

  },

  /*
   * Ingest new time delta from scoring slice.
   *
   * @param {Number} duration: The remaining time.
   *
   * @return void.
   */
  update: function(duration) {
    this.$el.text(duration);
  },

  /*
   * Convert a millisecond duration to hours, minutes,
   * seconds, and milliseconds.
   *
   * @param {Number} d: The duration in milliseconds.
   *
   * @return void.
   */
  _msToDuration: function(d) {
    var mls = Math.floor(d % 1000); d /= 1000;
    var sec = Math.floor(d % 60); d /= 60;
    var min = Math.floor(d % 60); d /= 60;
    var hrs = Math.floor(d % 24);
    return [hrs, min, sec, mls];
  }

});
