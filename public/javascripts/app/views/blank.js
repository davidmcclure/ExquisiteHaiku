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
   * Construct submission stack container.
   *
   * @return void.
   */
  initialize: function() {

    // Build stack.
    this.buildStack();

  },

  /*
   * Detach the markup.
   *
   * @return void.
   */
  buildStack: function() {

    // Construct the div.
    this.stack = $('<div class="submissions" />');
    $('body').append(this.stack);

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
    this.position();
  },

  /*
   * Position the stack container.
   *
   * @return void.
   */
  position: function() {

    // Get input offset and height.
    var offset = this.$el.offset();
    var height = this.$el.outerHeight();

    // Position stack.
    this.stack.css({
      'top': offset.top + height,
      'left': offset.left
    });

  },

  /*
   * Build submission functionality.
   *
   * @return void.
   */
  activateSubmit: function() {

    // Event listeners.
    this.$el.bind({

      'keypress': _.bind(function(e) {

        // Enter.
        if (e.keyCode === 13) {
          this.addWord();
        }

      }, this)

    });

  },

  /*
   * Build voting functionality.
   *
   * @return void.
   */
  activateVote: function() {

  },

  /*
   * Add new word to submission stack.
   *
   * @return void.
   */
  addWord: function() {
    console.log('add %s', this.$el.val());
  }

});
