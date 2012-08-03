/*
 * Count view.
 */

Ov.Views.Count = Backbone.View.extend({

  /*
   * Render a new value.
   *
   * @param {Number} count: The vote count.
   *
   * @return void.
   */
  render: function(count) {
    this.$el.text(count);
  }

});
