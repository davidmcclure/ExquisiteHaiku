/*
 * End-state view.
 */

Ov.Views.End = Backbone.View.extend({

  template: function() {
    return _.template($('#end-state').html());
  },

  /*
   * Build template.
   *
   * @return void.
   */
  initialize: function() {
    this.container = $(this.template()());
    this.hash = this.container.find('.hash');
    this.poem = this.container.find('.poem');
  },

  /*
   * Render end state.
   *
   * @param {Element} poem: The poem markup.
   *
   * @return void.
   */
  render: function(poem) {
    this.poem.append(poem);
    this.hash.text(P.hash);
    $('body').html('');
    $('body').append(this.container);
  }

});
