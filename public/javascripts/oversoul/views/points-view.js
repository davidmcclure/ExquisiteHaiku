/*
 * Points view.
 */

Ov.Views.Points = Backbone.View.extend({

  el: '#points',

  /*
   * Set starting value.
   *
   * @return void.
   */
  initialize: function() {
    this.value = null;
    this.preview = null;
  },

  /*
   * Set starting value.
   *
   * @param {Number} value: The value.
   *
   * @return void.
   */
  setStartingValue: function(value) {
    if (_.isNull(this.value)) this.renderValue(value);
  },

  /*
   * Render a value.
   *
   * @param {Number} value: The value.
   *
   * @return void.
   */
  renderValue: function(value) {
    this.$el.text(value);
    this.value = value;
    this.$el.removeClass('preview');
  },

  /*
   * Render a preview value.
   *
   * @param {Number} dragQuantity: The drag value.
   *
   * @return void.
   */
  renderPreview: function(dragQuantity) {

    // Render the value.
    this.preview = this.value - Math.abs(dragQuantity);
    this.$el.text(this.preview);
    this.$el.addClass('preview');
    this.$el.removeClass('negative');

    // Insufficient funds.
    if (this.preview < 0) {
      this.$el.removeClass('preview');
      this.$el.addClass('negative');
      Ov.vent.trigger('points:invalid');
    }

  },

  /*
   * Commit current preview value.
   *
   * @param {String} word: The word.
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
   */
  commitPreview: function(word, quantity) {

    // If sufficient points, commit.
    if (this.preview >= 0) {
      this.renderValue(this.preview);
      Ov.vent.trigger('points:commitVote', word, quantity);
      Ov.vent.trigger('points:newValue', this.value);
    }

  }

});
