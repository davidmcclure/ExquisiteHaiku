/*
 * Votes stack view.
 */

Ov.Views.Votes = Backbone.View.extend({

  /*
   * Prepare trackers.
   *
   * @return void.
   */
  initialize: function() {
    this.visible = false;
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

    // If hidden, break.
    if (!this.visible) return;

    // Create the vote.
    var vote = new Ov.Views.Vote({
      word: word, value: value
    });

    // Prepend the row.
    this.$el.prepend(vote.$el);

  },

  /*
   * Show votes.
   *
   * @return void.
   */
  show: function() {
    this.visible = true;
  },

  /*
   * Hide votes.
   *
   * @return void.
   */
  hide: function() {
    this.visible = false;
    this.empty();
  },

  /*
   * Empty stack.
   *
   * @return void.
   */
  empty: function() {
    this.$el.empty();
  }

});
