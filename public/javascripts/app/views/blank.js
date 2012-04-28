/*
 * View for blank.
 */

var BlankView = Backbone.View.extend({

  /*
   * Markup attributes.
   */
  tagName: 'input',
  className: 'blank',

  /*
   * The element attributes.
   */
  attributes: {
    type: 'text'
  },

  /*
   * Event bindings.
   */
  events: {

  },

  /*
   * Detach the markup.
   *
   * @return void.
   */
  detach: function() {
    this.$el.detach();
  },

  /*
   * Insert the blank at the end of the passed line.
   *
   * @param {Element} line: The line container.
   *
   * @return void.
   */
  insert: function(line) {
    line.append(this.$el);
  },

  /*
   * Position the stack container.
   *
   * @return void.
   */
  position: function() {

  }

});
