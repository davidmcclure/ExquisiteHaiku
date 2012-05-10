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

    // Trackers.
    this.wordRows = [];
    this.wordsToRows = {};

    // Statuses.
    this.hoverWord = null;
    this.selectWord = null;
    this.frozen = false;

  },

  /*
   * Render stack data.
   *
   * @param {Array} stack: The word data.
   *
   * @return void.
   */
  update: function(stack) {

    // If frozen, break.
    if (this.frozen) return;

    // Unhover hovered word.
    if (!_.isNull(this.hoverWord)) {
      this.wordsToRows[this.hoverWord].unHover();
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

    // Re-hover hovered word.
    if (!_.isNull(this.hoverWord)) {
      this.wordsToRows[this.hoverWord].hover();
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
   * Freeze stack rendering.
   *
   * @return void.
   */
  freeze: function() {
    this.frozen = true;
    this.$el.addClass('frozen');
  },

  /*
   * Unfreeze stack rendering.
   *
   * @return void.
   */
  unFreeze: function() {
    this.frozen = false;
    this.$el.removeClass('frozen');
  },

  /*
   * Render a word hover.
   *
   * @param {String} word: The word text.
   *
   * @return void.
   */
  hover: function(word) {
    if (this.frozen) return;
    this.wordsToRows[word].hover();
    this.hoverWord = word;
  },

  /*
   * Remove a word hover.
   *
   * @param {String} word: The word text.
   *
   * @return void.
   */
  unHover: function(word) {
    if (this.frozen) return;
    this.wordsToRows[word].unHover();
    this.hoverWord = null;
  },

  /*
   * Select a word.
   *
   * @param {String} word: The word text.
   *
   * @return void.
   */
  select: function(word) {

    // Unselect selected word.
    if (!_.isNull(this.selectWord)) {
      this.unSelect(this.selectWord);
    }

    this.wordsToRows[word].select();
    this.selectWord = word;

  },

  /*
   * Unselect a word.
   *
   * @param {String} word: The word text.
   *
   * @return void.
   */
  unSelect: function(word) {
    this.wordsToRows[word].unSelect();
    this.selectWord = null;
  },

  /*
   * Propagate a drag quantity to its word.
   *
   * @param {String} word: The word text.
   * @param {Number} quantity: The quantity.
   *
   * @return void.
   */
  propagateDrag: function(word, quantity) {
    // console.log(word, quantity);
    this.wordsToRows[word].quantity = quantity;
  }

});
