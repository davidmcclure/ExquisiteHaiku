/*
 * Stack view.
 */

Ov.Views.Stack = Backbone.View.extend({

  wordTemplate: function() {
    return _.template($(this.options.word).html());
  },

  /*
   * Compile word template, initialize trackers.
   *
   * @return void.
   */
  initialize: function() {

    // Word template.
    this.__word = this.wordTemplate();

    // Trackers.
    this.rows = [];
    this.words = {};

  },

  /*
   * Render stack data.
   *
   * @param {Array} stack: The word data.
   *
   * @return void.
   */
  update: function(stack) {

    // Walk stack data elements.
    _.times(stack.length, _.bind(function(i) {

      // If necessary, add row.
      if (i > this.rows.length-1) {
        this.addRow(stack[i].word);
      }

      // Render values.
      this.rows[i].update(stack[i]);

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

    // Create new word view.
    var row = new Ov.Views.Word({
      template: this.__word
    });

  }

});
