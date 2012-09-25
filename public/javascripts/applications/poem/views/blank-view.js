/*
 * Blank view.
 */

Ov.Views.Blank = Backbone.View.extend({

  tagName: 'input',
  className: 'blank',

  stackTemplate: function() {
    return _.template($('#submission-stack').html());
  },

  wordTemplate: function() {
    return _.template($('#submission-word').html());
  },

  /*
   * Prepare trackers and stack.
   *
   * @return void.
   */
  initialize: function() {

    // Validation cache.
    this.cache = { valid: [], invalid: [] };

    // Bind events.
    this.$el.bind({

      // Keystroke release.
      'keyup': _.bind(function(e) {
        this.processKeystroke(e);
      }, this)

    });

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
   * Detach the markup.
   *
   * @return void.
   */
  detach: function() {
    this.$el.detach();
  },

  /*
   * Handle keystroke on input.
   *
   * @param {Object} event: The keypress event.
   *
   * @return void.
   */
  processKeystroke: function(event) {

    // Get word, fit width.
    var word = this.scrubWord(this.$el.val());

    // Enter keystroke.
    if (event.keyCode == 13) {

      // Try to validate and add word.
      this.validateWord(word, _.bind(function(valid) {
        if (valid) this.addWord(word);
      }, this));

    }

    // Regular keystroke.
    if (event.keyCode !== 13) {

      // Validate word.
      this.validateWord(word, _.bind(function(valid) {
        this.cacheValidation(word, valid);
      }, this));

    }

  },

  /*
   * Add new word to submission stack.
   *
   * @param {String} word: The word.
   *
   * @return void.
   */
  addWord: function(word) {
    Ov.vent.trigger('points:vote', word, P.submissionVal);
    this.$el.val('');
  },

  /*
   * Remove word from submission stack.
   *
   * @param {Element} wordMarkup: The stack word.
   *
   * @return void.
   */
  removeWord: function(wordMarkup) {

    // Get word, remove markup.
    var word = wordMarkup.data('word');
    wordMarkup.remove();

    // Update tracker.
    this.words = _.filter(this.words, function(w) {
      return w === word ? false : true;
    });

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

    // If the word is cached as invalid.
    else if (_.include(this.cache.invalid, word)) {
      cb(false);
    }

    // If the word is cached as valid.
    else if (_.include(this.cache.valid, word)) {
      cb(true);
    }

    // Do server validation.
    else {
      var vcb = function(valid) { cb(valid); };
      Ov.vent.trigger('blank:validate', word, vcb);
    }

  },

  /*
   * Store word validation status.
   *
   * @param {String} word: The word.
   * @param {Boolean} valid: True if valid.
   *
   * @return void.
   */
  cacheValidation: function(word, valid) {

    // Valid cache.
    if (valid && !_.include(this.cache.valid, word)) {
      this.cache.valid.push(word);
    }

    // Invalid cache.
    else if (!valid && !_.include(this.cache.invalid, word)) {
      this.cache.invalid.push(word);
    }

  },

  /*
   * Preview a hovered word in the blank.
   *
   * @param {String} word: The word.
   *
   * @return void.
   */
  showPreview: function(word) {
    this.$el.addClass('preview');
    this.$el.val(word);
  },

  /*
   * Remove preview.
   *
   * @return void.
   */
  hidePreview: function() {
    this.$el.removeClass('preview');
    this.$el.val('');
  }

});
