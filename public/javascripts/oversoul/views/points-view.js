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
    this.renderValue(Poem.seedCapital);
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
    this.preview = this.value - Math.abs(dragQuantity);
    this.$el.text(this.value - Math.abs(dragQuantity));
    this.$el.addClass('preview');
  },

  /*
   * Commit current preview value.
   *
   * @param {Number} dragQuantity: The drag value.
   *
   * @return void.
   */
  commit: function(dragQuantity) {
    this.renderValue(this.preview);
  }

});
