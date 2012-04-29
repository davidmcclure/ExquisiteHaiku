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

    // Build templates.
    this.buildTemplates();

    // Build stack.
    this.buildStack();

  },

  /*
   * Build templates.
   *
   * @return void.
   */
  buildTemplates: function() {

    // Stack.
    this.stackTemplate = _.template(
      $('#submission-stack').html()
    );

    // Word.
    this.wordTemplate = _.template(
      $('#submission-word').html()
    );

  },

  /*
   * Build the stack markup.
   *
   * @return void.
   */
  buildStack: function() {
    this.stack = $(this.stackTemplate());
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
    this.position(line);
  },

  /*
   * Position the stack container.
   *
   * @return void.
   */
  position: function(line) {

    // Get input offset and height.
    var offset = this.$el.offset();
    var height = this.$el.outerHeight();

    // Insert markup.
    line.append(this.stack);

    // Position.
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

    // Build word.
    var wordMarkup = $(this.wordTemplate({
      word: this.$el.val()
    }));

    // Prepend to stack
    this.stack.prepend(wordMarkup);

  }

});
