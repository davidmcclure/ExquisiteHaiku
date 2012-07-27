/*
 * Log view.
 */

Ov.Views.Log = Backbone.View.extend({

  options: {
    maxLength: 50
  },

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
    this.primaryMarkup = this.$el.find('td.primary');
    this.overflowMarkup = this.$el.find('td.overflow');

    // Trackers.
    this.primaryVotes = [];
    this.overflowVotes = [];
    this.frozen = false;
    this.voting = false;

  },

  /*
   * Clear out the stacks.
   *
   * @return void.
   */
  activateSubmit: function() {
    if (!this.empty) {
      this.primaryMarkup.empty();
      this.overflowMarkup.empty();
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

    // Prepend to primary.
    if (!this.frozen) {
      this.primaryMarkup.prepend(vote.$el);
      this.primaryVotes.unshift(vote);
    }

    // If frozen, prepend to overflow.
    else {
      this.overflowMarkup.prepend(vote.$el);
      this.overflowVotes.unshift(vote);
    }

    this.empty = false;
    this.prune();

  },

  /*
   * Push new vote propagations onto the overflow.
   *
   * @return void.
   */
  freeze: function() {
    if (Ov._global.isDragging) return;
    this.$el.addClass('frozen');
    this.frozen = true;
  },

  /*
   * Merge overflow back into the primary stack.
   *
   * @return void.
   */
  unFreeze: function() {

    // Merge overflow -> primary.
    var overflow = this.overflowMarkup.contents().detach();
    overflow.prependTo(this.primaryMarkup);

    // Append primary onto overflow.
    this.overflowVotes = this.overflowVotes.concat(
      this.primaryVotes
    );

    // Overflow -> primary, clear overflow.
    this.primaryVotes = this.overflowVotes;
    this.overflowVotes = [];

    // Unfreeze and prune.
    Ov.vent.trigger('words:unhover');
    this.$el.removeClass('frozen');
    this.frozen = false;
    this.prune();


  },

  /*
   * Reduce both stacks to contain maxLength votes.
   *
   * @return void.
   */
  prune: function() {

    // Primary.
    while (this.primaryVotes.length > this.options.maxLength) {
      this.primaryVotes.pop().$el.remove();
    }

    // Overflow.
    while (this.overflowVotes.length > this.options.maxLength) {
      this.overflowVotes.pop().$el.remove();
    }

  }

});
