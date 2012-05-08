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
    this.table = this.$el.find('table');
    this.rows = [];

    // Templates.
    this.__row = this.rowTemplate();
    this.__value = this.valueTemplate();
    this.__word = this.wordTemplate();

    // Build markup.
    this.buildRows();

  },

  /*
   * Construct and inject the word rows.
   *
   * @return void.
   */
  buildRows: function() {

    // Append one row for each visible word.
    _.times(Poem.visibleWords, _.bind(function() {

      // Build components.
      var row = $(this.__row());
      var value = $(this.__value());
      var word = $(this.__word());
      row.append(value).append(word);

      // Append and track.
      this.table.append(row);
      this.rows.push([value, word]);

    }, this));

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
      this.rows[i][0].text(stack[i][1]);
      this.rows[i][1].text(stack[i][0]);
    }, this));

  }

});
