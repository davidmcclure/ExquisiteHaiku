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
    this.primary = this.$el.find('td.primary');
    this.overflow = this.$el.find('td.overflow');

    // Trackers.
    this.empty = true;
    this.frozen = false;

  },

  /*
   * Clear out the stacks.
   *
   * @return void.
   */
  activateSubmit: function() {
    if (!this.empty) {
      this.primary.empty();
      this.overflow.empty();
      this.empty = true;
    }
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
    if (!this.frozen) this.primary.prepend(vote.$el);
    else this.overflow.prepend(vote.$el);
    this.empty = false;

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

    // Merge overflow -> primary.
    var overflow = this.overflow.contents().detach();
    overflow.prependTo(this.primary);

    // Unfreeze and prune.
    this.frozen = false;
    this.$el.removeClass('frozen');

  }

});
