/*
 * Log view.
 */

Ov.Views.Log = Backbone.View.extend({

  events: {
    'mouseenter':   'freeze',
    'mouseleave':   'unFreeze'
  },

  /*
   * Get markup.
   *
   * @return void.
   */
  initialize: function() {

    // Getters.
    this.primary = this.$el.find('div.primary');
    this.overflow = this.$el.find('div.overflow');

    // Trackers.
    this.frozen = false;

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

  },

  /*
   * Push new vote propagations onto the overflow.
   *
   * @return void.
   */
  freeze: function() {
    this.frozen = true;
    this.$el.addClass('frozen');
  },

  /*
   * Merge overflow back into the primary stack.
   *
   * @return void.
   */
  unFreeze: function() {
    this.frozen = false;
    this.$el.removeClass('frozen');
  }

});
