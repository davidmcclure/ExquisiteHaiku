/*
 * Word stack view.
 */

Ov.Views.Words = Backbone.View.extend({

  /*
   * Prepare trackers.
   *
   * @return void.
   */
  initialize: function() {

    // Buckets.
    this.wordRows = [];

    // Trackers.
    this.hoverWord = null;
    this.selectWord = null;
    this.visible = false;
    this.frozen = false;

  },

  /*
   * Render stack data.
   *
   * @param {Array} stack: The word data.
   *
   * @return void.
   */
  update: function(stack) {

    // If frozen, break.
    if (this.frozen || !this.visible) return;

    _.times(stack.length, _.bind(function(i) {

      // Get word, add row.
      var word = stack[i][0];
      if (i > this.wordRows.length-1) {
        this.addRow(word);
      }

      // Render values.
      this.wordRows[i].update(stack[i]);

    }, this));

  },

  /*
   * Construct and inject a word row.
   *
   * @param {String} word: The word text.
   *
   * @return void.
   */
  addRow: function(word) {

    // Build row view.
    var row = new Ov.Views.Word();

    // Append and track.
    this.$el.append(row.$el);
    this.wordRows.push(row);

  },

  /*
   * Freeze stack rendering.
   *
   * @return void.
   */
  freeze: function() {
    this.frozen = true;
    this.$el.addClass('frozen');
  },

  /*
   * Unfreeze stack rendering.
   *
   * @return void.
   */
  unFreeze: function() {
    this.frozen = false;
    this.$el.removeClass('frozen');
  },

  /*
   * Show stacks.
   *
   * @return void.
   */
  show: function() {
    this.visible = true;
  },

  /*
   * Hide stacks.
   *
   * @return void.
   */
  hide: function() {
    this.visible = false;
    this.empty();
  },

  /*
   * Empty words.
   *
   * @return void.
   */
  empty: function() {
    this.wordRows = [];
    this.$el.empty();
  }

});
