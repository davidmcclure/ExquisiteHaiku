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
   * Line template.
   */
  lineTemplate: function() {
    _.template($('#poem-line').html());
  },

  /*
   * Word template.
   */
  wordTemplate: function() {
    _.template($('#poem-word').html());
  },

  /*
   * Bind events.
   */
  events: {

  },

  /*
   * Append container.
   *
   * @param {Element} container: The container.
   *
   * @return void.
   */
  initialize: function(container) {
    this.render(container);
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
