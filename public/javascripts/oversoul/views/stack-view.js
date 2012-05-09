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

      // If necessary, add row.
      if (i > this.rows.length-1) {
        this.addRow();
      }

      // Render values.
      this.rows[i].update(stack[i]);

    }, this));

  },

  /*
   * Construct and inject a word row.
   *
   * @return void.
   */
  addRow: function() {

    // Build components.
    var row = $(this.__row());
    var value = $(this.__value());
    var word = $(this.__word());
    row.append(value).append(word);

    // Append and track.
    this.$el.append(row);
    this.rows.push([value, word]);

  }

});
