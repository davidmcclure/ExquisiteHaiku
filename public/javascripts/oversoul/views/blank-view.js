/*
 * Blank view.
 */

Ov.Views.Blank = Backbone.View.extend({

  tagName: 'input',
  className: 'blank',

  __stack: _.template($('#submission-stack').html()),
  __word: _.template($('#submission-word').html()),

  /*
   * Prepare trackers and stack.
   *
   * @return void.
   */
  initialize: function() {
    this.words = [];
    this.stack = $(this.__stack());
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
   * @param {String} word: The word.
   *
   * @return void.
   */
  addWord: function(word) {

    // Build word.
    var wordMarkup = $(this.__word({ word: word }));

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
   * @param {Function} cb: Callback.
   *
   * @return void.
   */
  validateWord: function(word, cb) {

    // If the word is a duplicate.
    if (_.include(this.words, word)) {
      cb(false);
    }

    // Do server validation.
    else {
      cb(true);
    }

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

