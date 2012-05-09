/*
 * Stack view.
 */

Ov.Views.Stack = Backbone.View.extend({

  /*
   * Initialize trackers.
   *
   * @return void.
   */
  initialize: function() {
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

    _.times(stack.length, _.bind(function(i) {

      var word = stack[i][0];

      // If necessary, add row.
      if (i > this.rows.length-1) {
        this.addRow(word);
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

    // Build row view.
    var row = new Ov.Views.Word();

    // Append and track.
    this.$el.append(row.$el);
    this.rows.push(row);

  }

});
