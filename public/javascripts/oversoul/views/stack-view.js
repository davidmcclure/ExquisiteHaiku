/*
 * Stack view.
 */

Ov.Views.Stack = Backbone.View.extend({

  /*
   * Prepare trackers.
   *
   * @return void.
   */
  initialize: function() {
    this.wordRows = [];
    this.wordsToRows = {};
    this.hoverWord = null;
  },

  /*
   * Render stack data.
   *
   * @param {Array} stack: The word data.
   *
   * @return void.
   */
  update: function(stack) {

    // Unhighlight highlighted word.
    if (!_.isNull(this.hoverWord)) {
      this.wordsToRows[this.hoverWord].unHighlight();
    }

    _.times(stack.length, _.bind(function(i) {

      // Get word text.
      var word = stack[i][0];

      // If necessary, add row.
      if (i > this.wordRows.length-1) {
        this.addRow(word);
      }

      // Render values.
      this.wordRows[i].update(stack[i]);
      this.wordsToRows[word] = this.wordRows[i];

    }, this));

    // Re-highlight highlighted word.
    if (!_.isNull(this.hoverWord)) {
      this.wordsToRows[this.hoverWord].highlight();
    }

  },

  /*
   * Construct and inject a word row.
   *
   * @param {String} word: The word text.
   *
   * @return void.
   */
  addRow: function(word) {

    // Build row view.
    var row = new Ov.Views.Word();

    // Append and track.
    this.$el.append(row.$el);
    this.wordRows.push(row);

  },

  /*
   * Render a word highlight.
   *
   * @param {String} word: The word text.
   *
   * @return void.
   */
  highlight: function(word) {
    this.wordsToRows[word].highlight();
    this.hoverWord = word;
  },

  /*
   * Render a word highlight.
   *
   * @param {String} word: The word text.
   *
   * @return void.
   */
  unHighlight: function(word) {
    this.wordsToRows[word].unHighlight();
    this.hoverWord = null;
  }

});
