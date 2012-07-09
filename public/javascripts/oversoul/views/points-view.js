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
   * Activate submit state.
   *
   * @return void.
   */
  activateSubmit: function() {
    this.renderValue(Poem.seedCapital);
  },

  /*
   * Activate vote state.
   *
   * @param {Object} round: The round record.
   *
   * @return void.
   */
  activateVote: function(round) {
    if (_.isNull(this.value)) {
      this.renderValue(round.get('points'));
    }
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
   * If there are sufficient points, release the vote to
   * the socket controller and terminate the drag on the
   * drag on the word view instance.
   *
   * @param {Object} word: The stack word view instance.
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
   */
  commit: function(word, quantity) {

    // If sufficient points, commit.
    if (this.preview >= 0) {
      this.renderValue(this.preview);
      Ov.vent.trigger('points:releaseVote', word.word, quantity);
      Ov.vent.trigger('points:newValue', this.value);
    }

    // Otherwise, cancel the drag.
    else {
      this.renderValue(this.value);
      Ov.vent.trigger('words:dragCancel');
    }

    // Reset the word.
    word.endDrag();

  }

});
