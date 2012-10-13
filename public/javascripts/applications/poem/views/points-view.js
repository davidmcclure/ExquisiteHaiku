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

    // Getters.
    this.percent = this.$el.find('span.percent');
    this.value = this.$el.find('span.value');

  },

  /*
   * Render the current base value.
   *
   * @return void.
   */
  reset: function() {
    this.renderValue(Ov.global.points);
  },

  /*
   * Render a value.
   *
   * @param {Number} value: The value.
   *
   * @return void.
   */
  renderValue: function(value) {

    // Compute percent.
    var percent = value / P.seedCapital;

    // Render values.
    this.value.text(value);
    this.percent.text(percent.toFixed(2));
    this.$el.removeClass('preview negative');

  },

  /*
   * Render a preview value.
   *
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
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
    if (this.preview < 0)
      this.$el.removeClass('preview').addClass('negative');

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
    if (Ov.global.points - Math.abs(quantity) >= 0) {
      this.renderValue(this.preview);
      Ov.vent.trigger('points:vote', word, quantity);
      Ov.vent.trigger('points:newValue', Ov.global.points);
    }

    // Otherwise, cancel the drag.
    else Ov.vent.trigger('words:dragCancel');

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
    if (Ov.global.points - Math.abs(quantity) >= 0) {
      this.renderValue(this.preview);
      Ov.vent.trigger('points:vote', word, quantity);
      Ov.vent.trigger('points:newValue', Ov.global.points);
      this.renderPreview(quantity);
    }

  }

});
