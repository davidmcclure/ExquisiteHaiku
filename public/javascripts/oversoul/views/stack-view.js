/*
 * Stack view.
 */

Ov.Views.Stack = Backbone.View.extend({

  rowTemplate: function() {
    return _.template($('#stack-row').html());
  },

  valueTemplate: function() {
    return _.template($('#stack-value').html());
  },

  wordTemplate: function() {
    return _.template($('#stack-word').html());
  },

  /*
   * Set container, build markup.
   *
   * @param {String} el: The container selector.
   *
   * @return void.
   */
  initialize: function() {

    // Trackers.
    this.rows = [];
    this.words = {};

    // Templates.
    this.__row = this.rowTemplate();
    this.__value = this.valueTemplate();
    this.__word = this.wordTemplate();

  },

  /*
   * Render stack data.
   *
   * @param {Array} stack: The word data.
   *
   * @return void.
   */
  update: function(stack) {

    _.times(stack.length, _.bind(function(i) {

      // Get word and value.
      var word = stack[i][0];
      var value = stack[i][1];

      // If necessary, add row.
      if (i > this.rows.length-1) {
        this.addRow(word);
      }

      // Render values.
      this.rows[i][0].text(value);
      this.rows[i][1].text(word);

    }, this));

  },

  /*
   * Construct and inject a word row.
   *
   * @param {String} word: The word text.
   *
   * @return void.
   */
  addRow: function(word) {

    // Build components.
    var rowMarkup = $(this.__row());
    var valueMarkup = $(this.__value());
    var wordMarkup = $(this.__word());
    rowMarkup.append(valueMarkup).append(wordMarkup);

    // Track row and word.
    this.$el.append(rowMarkup);
    this.words[word] = wordMarkup;

    // Append and bind events.
    this.rows.push([valueMarkup, wordMarkup]);

  }

});
