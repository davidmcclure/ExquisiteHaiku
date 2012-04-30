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

    // Initialize trackers.
    this.words = [];

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

    // Bind events.
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

    // Get word.
    var word = this.scrubWord(this.$el.val());

    // Validate word.
    if (!this.validateWord(word)) {
      return;
    }

    // Build word.
    var wordMarkup = $(this.wordTemplate({
      word: word
    }));

    // Prepend markup, tack value.
    this.stack.prepend(wordMarkup);
    this.words.push(word);
    wordMarkup.data('word', word);

    // Bind events.
    wordMarkup.bind({
      'mousedown': _.bind(function() {
        this.removeWord(wordMarkup);
      }, this)
    });

    // Clear input.
    this.$el.val('');

  },

  /*
   * Trim and lowercase word.
   *
   * @param {String} word: The word.
   *
   * @return {String}: The scrubbed value.
   */
  scrubWord: function(word) {
    return $.trim(word).toLowerCase();
  },

  /*
   * Validate word, flash error if invalid.
   *
   * @param {String} word: The word.
   *
   * @return {Boolean}: True if valid, false if not.
   */
  validateWord: function(word) {

    // Check for duplicate.
    if (_.include(this.words, word)) {
      return false;
    }

    // Do server validation.
    else {

    }

    return true;

  },

  /*
   * Remove word from submission stack.
   *
   * @param {Element} wordMarkup: The stack word.
   *
   * @return void.
   */
  removeWord: function(wordMarkup) {

    // Get word.
    var word = wordMarkup.data('word');

    // Remove markup.
    wordMarkup.remove();

    // Update tracker.
    this.words = _.filter(this.words, function(w) {
      return w === word ? false : true;
    });

  }

});
