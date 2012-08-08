/*
 * Log view.
 */

Ov.Views.Log = Backbone.View.extend({

  options: {
    maxLength: 50
  },

  /*
   * Get markup.
   *
   * @return void.
   */
  initialize: function() {

    // Getters.
    this.primaryMarkup = $('#log');
    this.overflowMarkup = $('#overflow');

    // Trackers.
    this.primaryVotes = [];
    this.overflowVotes = [];
    this.frozen = false;
    this.voting = false;

    // Listen for hover.
    this.primaryMarkup.bind({

      'mouseenter': _.bind(function() {
        this.freeze();
      }, this),

      'mouseleave': _.bind(function() {
        this.unFreeze();
      }, this)

    });

  },

  /*
   * Clear out the stacks.
   *
   * @return void.
   */
  activateSubmit: function() {
    this.voting = false;
    if (!this.empty) {
      this.primaryMarkup.empty();
      this.overflowMarkup.empty();
      this.empty = true;
    }
  },

  /*
   * Enable log rendering.
   *
   * @return void.
   */
  activateVote: function() {
    this.voting = true;
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

    // Break if submitting.
    if (!this.voting) return;

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
    this.primaryMarkup.addClass('frozen');
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
    this.primaryMarkup.removeClass('frozen');
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
