/*
 * Word view.
 */

Ov.Views.Word = Backbone.View.extend({

  tagName: 'tr',
  className: 'stack-word',

  template: function() {
    return _.template($('#stack-word').html());
  },

  /*
   * Build template, get components.
   *
   * @return void.
   */
  initialize: function() {
    this.$el.append(this.template()());
    this.value = this.$el.find('.stack-value');
    this.word = this.$el.find('.stack-word');
  },

  /*
   * Render new values.
   *
   * @param {Array} data: Array of [word, value].
   *
   * @return void.
   */
  update: function(data) {
    this.word.text(data[0]);
    this.value.text(data[1]);
  }

});

