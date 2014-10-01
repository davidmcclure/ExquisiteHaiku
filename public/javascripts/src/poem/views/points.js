
/**
 * Points view.
 */

Ov.Views.Points = Backbone.View.extend({

  /**
   * Set starting value.
   */
  initialize: function() {

    // Getters.
    this.percent = this.$el.find('.percent');
    this.value = this.$el.find('.value');

  },

  /**
   * Render the current base value.
   */
  reset: function() {
    this.setPoints(Ov.global.points);
  },

  /**
   * Render a preview value.
   *
   * @param {Number} value: The vote value.
   */
  setPreview: function(value) {

    // Compute preview and percent.
    this.preview = Ov.global.points - Math.abs(value);

    // Render the preview.
    this.renderValue(this.preview);
    this.$el.addClass('preview');

    // Insufficient funds.
    if (this.preview < 0) {
      this.$el.addClass('negative');
    }

  },

  /**
   * Update the current point count.
   *
   * @param {Number} value: The value.
   */
  setPoints: function(value) {
    this.renderValue(value);
    this.$el.removeClass('preview negative');
  },

  /**
   * Render a value.
   *
   * @param {Number} value: The value.
   */
  renderValue: function(value) {
    var percent = (value / P.seedCapital) * 100;
    this.percent.text(Math.round(percent) + '%');
    this.value.text(value);
  }

});
