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

      // If necessary, add row.
      if (i > this.rows.length-1) {
        this.addRow();
      }

      // Render values.
      this.rows[i][0].text(stack[i][1]);
      this.rows[i][1].text(stack[i][0]);

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
