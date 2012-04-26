/*
 * View for poem.
 */

var PoemView = Backbone.View.extend({

  /*
   * The container markup.
   */
  tagName: 'div',

  /*
   * The container class.
   */
  className: 'poem',

  /*
   * Line and word templates.
   */
  lineTemplate: _.template(lineTemplate),
  wordTemplate: _.template(wordTemplate),

  /*
   * Bind events.
   */
  events: {

  },

  /*
   * Append container.
   *
   * @return void.
   */
  initialize: function() {
    this.render();
  },

  /*
   * Render the container element.
   *
   * @return void.
   */
  render: function(container) {
    $('.left').append(this.$el);
  },

  /*
   * Render poem words.
   *
   * @param {Array} poem: The poem.
   *
   * @return void.
   */
  update: function(poem) {

  }

});
