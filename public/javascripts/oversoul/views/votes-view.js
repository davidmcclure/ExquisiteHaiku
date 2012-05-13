/*
 * Votes stack view.
 */

Ov.Views.Votes = Backbone.View.extend({

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
    var vote = new Ov.Views.Vote({
      word: word, value: value
    });

    // Prepend the row.
    this.$el.prepend(vote.$el);

  }

});
