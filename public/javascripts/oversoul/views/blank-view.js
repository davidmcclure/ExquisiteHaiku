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

    // Templates.
    this.__stack = this.stackTemplate();
    this.__word = this.wordTemplate();
    this.__measure = $('#measure');

    // Buckets.
    this.words = [];
    this.cache = { valid: [], invalid: [] };

    // Trackers.
    this.frozen = false;
    this.voting = false;
    this.defWidth = null;

    // Submissions stack.
    this.stack = $(this.__stack());

    // Bind events.
    this.$el.bind({

      // Keystroke release.
      'keyup': _.bind(function(e) {
        if (!this.voting) this.processKeystroke(e);
      }, this),

      // Keystroke down.
      'keydown': _.bind(function(e) {
        var char = String.fromCharCode(e.keyCode);
        this.fitWidth(this.$el.val()+char);
      }, this)

    });

  },

  /*
   * Activate submission mode.
   *
   * @return void.
   */
  activateSubmit: function() {

    // Break if not voting.
    if (!this.voting) return;

    // Reset attributes.
    this.voting = false;
    this.words = [];
    this.cache.valid = [];
    this.cache.invalid = [];

    // Clear the stack and blank.
    this.stack.empty();
    this.$el.removeAttr('disabled');
    this.$el.val('');

  },

  /*
   * Activate voting mode.
   *
   * @return void.
   */
  activateVote: function() {
    this.stack.detach();
    this.voting = true;
    this.$el.attr('disabled', 'disabled');
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
    this.defWidth = parseInt(this.$el.css('width'), 10);
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
   * Position the stack container.
   *
   * @return void.
   */
  position: function(line) {

    // Get input offset and height.
    var offset = this.$el.position();
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
   * Handle keystroke on input.
   *
   * @param {Object} event: The keypress event.
   *
   * @return void.
   */
  processKeystroke: function(event) {

    // Get word, fit width.
    var word = this.$el.val();

    // Enter keystroke.
    if (event.keyCode == 13) {

      // Try to validate and add word.
      this.validateWord(word, _.bind(function(valid) {
        if (valid) this.addWord(word);
      }, this));

    }

    // ** dev: submit with CONTROL.
    else if (event.keyCode == 17) {
      if (this.words.length >= Poem.minSubmissions) {
        Ov.vent.trigger('blank:submit', this.words);
      }
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

    // Build word.
    var wordMarkup = $(this.__word({ word: word }));

    // Prepend markup, tack value.
    this.stack.prepend(wordMarkup);
    this.words.push(word);
    wordMarkup.data('word', word);

    // Bind events.
    wordMarkup.bind({

      // Highlight word red.
      'mouseenter': _.bind(function() {
        wordMarkup.addClass('negative');
      }, this),

      // Unhighlight word.
      'mouseleave': _.bind(function() {
        wordMarkup.removeClass('negative');
      }, this),

      // Remove word from stack.
      'mousedown': _.bind(function() {
        this.removeWord(wordMarkup);
      }, this)

    });

    // Clear input.
    this.$el.val('');
    this.fitWidth('');

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
    this.fitWidth(word);
    if (this.frozen) return;
    this.$el.addClass('preview');
    this.$el.val(word);
  },

  /*
   * Remove preview.
   *
   * @return void.
   */
  hidePreview: function() {
    if (this.frozen) return;
    this.$el.removeClass('preview');
    this.$el.val('');
    this.fitWidth('');
  },

  /*
   * Adjust the width to fit the value.
   *
   * @return void.
   */
  fitWidth: function(value) {

    // Measure value.
    this.__measure.html(value);
    var width = this.__measure.width();
    this.__measure.html('');

    // If less than default, revent to default.
    if (width <= this.defWidth)
      width = this.defWidth;

    // Render width.
    this.$el.css('width', width+3);

  },

  /*
   * Freeze preview rendering.
   *
   * @return void.
   */
  freeze: function() {
    this.frozen = true;
  },

  /*
   * Unfreeze preview rendering.
   *
   * @return void.
   */
  unFreeze: function() {
    this.frozen = false;
  }

});
