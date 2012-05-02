/*
 * Poem module.
 */

Oversoul.Poem = (function(Oversoul, Backbone, $) {

  var Poem = {};


  // ----------
  // Poem view.
  // ----------
  Poem.PoemView = Backbone.View.extend({

    el: '#poem',

    /*
     * Render poem words.
     *
     * @param {Array} poem: The poem.
     * @param {Number} syllables: The current syllable count.
     *
     * @return void.
     */
    update: function(poem, syllables) {

      // Detach blank.
      this.blank.detach();

      // Empty container.
      this.$el.empty();

      // Line array.
      var lines = [];

      // Walk lines.
      _.each(poem, _.bind(function(line) {

        // Insert line.
        var lineMarkup = $(this.lineTemplate());
        this.$el.append(lineMarkup);
        lines.push(lineMarkup);

        // Walk words.
        _.each(line, _.bind(function(word) {

          // Construct word.
          var wordMarkup = $(this.wordTemplate({
            word: word
          }));

          // Insert word.
          lineMarkup.append(wordMarkup);

        }, this));

      }, this));

      // If poem is on first line.
      if (syllables < 5) {

        // If no lines were created.
        if (lines.length === 0) {
          var lineMarkup = $(this.lineTemplate());
          this.$el.append(lineMarkup);
          lines.push(lineMarkup);
        }

        // Append blank.
        this.blank.insert(lines[0]);

      }

      // If poem is on second line.
      else if (syllables >= 5 && syllables < 12) {

        // If only 1 line was created.
        if (lines.length === 1) {
          var lineMarkup = $(this.lineTemplate());
          this.$el.append(lineMarkup);
          lines.push(lineMarkup);
        }

        // Append blank.
        this.blank.insert(lines[1]);

      }

      // If poem is on third line.
      else if (syllables >= 12 && syllables < 17) {

        // If only 2 lines were created.
        if (lines.length === 2) {
          var lineMarkup = $(this.lineTemplate());
          this.$el.append(lineMarkup);
          lines.push(lineMarkup);
        }

        // Append blank.
        this.blank.insert(lines[2]);

      }

    }

  });


  // -----------
  // Blank view.
  // -----------
  Poem.BlankView = Backbone.View.extend({

    tagName: 'input',
    className: 'blank',

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

  return Poem;

})(Oversoul, Backbone, $);
