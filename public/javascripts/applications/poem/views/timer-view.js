/*
 * Timer view.
 */

Ov.Views.Timer = Backbone.View.extend({

  options: {
    refresh: 250 // Ms between renders.
  },

  /*
   * Set rendering heartbeat.
   *
   * @return void.
   */
  initialize: function() {

    // Getters.
    this.percent = this.$el.find('span.percent');
    this.minutes = this.$el.find('span.min');
    this.seconds = this.$el.find('span.sec');

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

    // Get duration and time parts.
    var d = this.updateQuantity-(Date.now()-this.updateTime);
    var now = this._msToDuration(d);

    // Get percent.
    var percent = this.updateQuantity / P.roundLength;

    // Render text.
    this.percent.text(percent.toFixed(2));
    this.minutes.text(now[0]+':');
    this.seconds.text(now[1]);

  },

  /*
   * Convert a millisecond duration to hours, minutes,
   * seconds, and milliseconds.
   *
   * @param {Number} d: The duration in milliseconds.
   *
   * @return {Array}: [min, sec].
   */
  _msToDuration: function(d) {
    var sec = this._format(Math.floor((d/1000) % 60)); d /= 60000;
    var min = this._format(Math.floor(d % 60)); d /= 60;
    return [min, sec];
  },

  /*
   * If the passed value is a single digit, pad it with
   * a single zero. If the value is negative, set it to 0.
   *
   * @param {Number} val: The value.
   *
   * @return {Number} val: The padded value.
   */
  _format: function(val) {
    if (val < 0) val = 0;
    val = String(val);
    if (val.length < 2) val = 0+val;
    return val;
  }

});
