/*
 * End-state view.
 */

Ov.Views.Poem = Backbone.View.extend({

  template: function() {
    return _.template($('#end-state').html());
  },

  /*
   * Build template.
   *
   * @return void.
   */
  initialize: function() {
    this.__end = this.template();
  },

  /*
   * Render end state.
   *
   * @param {Element} poem: The poem markup.
   *
   * @return void.
   */
  render: function() {

  }

});
