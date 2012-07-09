/*
 * Timer view.
 */

Ov.Views.Timer = Backbone.View.extend({

  el: '#timer',

  options: {
    refresh: 100 // Ms between renders.
  },

  template: function() {
    return _.template($('#clock').html());
  },

  /*
   * Set rendering heartbeat.
   *
   * @return void.
   */
  initialize: function() {

    // Initialize update trackers.
    this.updateTime = null;
    this.updateQuantity = null;

    // Set the interval.
    var callback = _.bind(this.render, this);
    setInterval(callback, this.options.refresh);

  },

  /*
   * Ingest new time delta from scoring slice.
   *
   * @param {Number} duration: The remaining time.
   *
   * @return void.
   */
  update: function(duration) {
    this.updateTime = Date.now();
    this.updateQuantity = duration;
  },

  /*
   * Render the human-readable time remaining.
   *
   * @return void.
   */
  render: function() {

    // Get time parts.
    var current = this._msToDuration(
      this.updateQuantity - (Date.now() - this.updateTime)
    );

    // Render.
    this.$el.html(
      this.template()({
        hrs: current[0],
        min: current[1],
        sec: current[2],
        mls: current[3]
      })
    );

  },

  /*
   * Convert a millisecond duration to hours, minutes,
   * seconds, and milliseconds.
   *
   * @param {Number} d: The duration in milliseconds.
   *
   * @return {Array}: [hs, min, sec, mls].
   */
  _msToDuration: function(d) {
    var mls = Math.floor(d % 1000); d /= 1000;
    var sec = Math.floor(d % 60); d /= 60;
    var min = Math.floor(d % 60); d /= 60;
    var hrs = Math.floor(d % 24);
    return [hrs, min, sec, mls];
  }

});
