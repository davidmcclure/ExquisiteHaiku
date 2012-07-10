/*
 * Log view.
 */

Ov.Views.Log = Backbone.View.extend({

  /*
   * Get markup.
   *
   * @return void.
   */
  initialize: function() {

    // Getters.
    this.primary = this.$el.find('div.primary');
    this.overflow = this.$el.find('div.overflow');

  },

  /*
   * Add a new vote to the stack.
   *
   * @param {String} word: The word.
   * @param {Number} value: The vote quantity.
   *
   * @return void.
   */
  add: function(word, value) {

    // Create the vote.
    var vote = new Ov.Views.LogWord({
      word: word, value: value
    });

    // Prepend the row.
    this.primary.prepend(vote.$el);

  }

});
