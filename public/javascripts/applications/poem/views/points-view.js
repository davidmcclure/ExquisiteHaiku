/*
 * Points view.
 */

Ov.Views.Points = Backbone.View.extend({

  /*
   * Set starting value.
   *
   * @return void.
   */
  initialize: function() {
    this.value = null;
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
    this.$el.removeClass('preview negative');
  },

  /*
   * Render the current base value.
   *
   * @return void.
   */
  reset: function() {
    this.renderValue(this.value);
  },

  /*
   * Render a preview value.
   *
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
   */
  renderPreview: function(quantity) {

    // Render the value.
    this.preview = this.value - Math.abs(quantity);
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
   * If there are sufficient points, release the stack vote 
   * to the socket controller.
   *
   * @param {String} word: The word.
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
   */
  releaseStackVote: function(word, quantity) {

    // If sufficient points, commit.
    if (this.value - Math.abs(quantity) >= 0) {
      this.renderValue(this.preview);
      Ov.vent.trigger('points:releaseVote', word, quantity);
      Ov.vent.trigger('points:newValue', this.value);
    }

    // Otherwise, cancel the drag.
    else {
      Ov.vent.trigger('words:dragCancel');
    }

  },

  /*
   * If there are sufficient points, release the log echo 
   * to the socket controller.
   *
   * @param {String} word: The word.
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
   */
  releaseLogEcho: function(word, quantity) {

    // If sufficient points, commit.
    if (this.value - Math.abs(quantity) >= 0) {
      this.renderValue(this.preview);
      Ov.vent.trigger('points:releaseVote', word, quantity);
      Ov.vent.trigger('points:newValue', this.value);
      this.renderPreview(quantity);
    }

  }

});
