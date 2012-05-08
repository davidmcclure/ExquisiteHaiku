/*
 * Stack view.
 */

Ov.Views.Stack = Backbone.View.extend({

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

    // Get table.
    this.table = this.$el.find('table');

    // Template.
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
      this.table.append($(this.__word()));
    }, this));

  },

  /*
   * Render stack data.
   *
   * @param {Array} stack: The word data.
   *
   * @return void.
   */
  update: function(poem, syllables) {

  }

});
