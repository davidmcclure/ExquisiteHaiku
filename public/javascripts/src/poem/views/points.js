
/**
 * Points view.
 */

Ov.Views.Points = Backbone.View.extend({

  /**
   * Set starting value.
   */
  initialize: function() {

    // Getters.
    this.percent = this.$el.find('span.percent');
    this.value = this.$el.find('span.value');

  },

  /**
   * Render the current base value.
   */
  reset: function() {
    this.renderValue(Ov.global.points);
  },

  /**
   * Render a preview value.
   *
   * @param {Number} quantity: The vote quantity.
   */
  renderPreview: function(quantity) {

    // Compute preview and percent.
    this.preview = Ov.global.points - Math.abs(quantity);
    var percent = this.preview / P.seedCapital;

    // Render values.
    this.value.text(this.preview);
    this.percent.text(percent.toFixed(2));
    this.$el.removeClass('negative').addClass('preview');

    // Insufficient funds.
    if (this.preview < 0) {
      this.$el.removeClass('preview').addClass('negative');
    }

  },

  /**
   * Render a value.
   *
   * @param {Number} value: The value.
   */
  renderValue: function(value) {

    // Compute percent.
    var percent = value / P.seedCapital;

    // Render values.
    this.value.text(value);
    this.percent.text(percent.toFixed(2));
    this.$el.removeClass('preview negative');

  }

});
