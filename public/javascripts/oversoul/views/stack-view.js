/*
 * Stack view.
 */

Ov.Views.Stack = Backbone.View.extend({

  events: {
    'mouseenter': 'freeze',
    'mouseleave': 'unFreeze'
  },

  /*
   * Prepare trackers.
   *
   * @return void.
   */
  initialize: function() {

    // Buckets.
    this.wordRows = [];
    this.wordsToRow = {};

    // Trackers.
    this.selected = null;
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
    if (this.frozen) return false;

    _.times(stack.length, _.bind(function(i) {

      // Get word, add row.
      var word = stack[i][0];
      if (i > this.wordRows.length-1) {
        this.addRow();
      }

      // Render values.
      this.wordRows[i].update(stack[i]);
      this.wordsToRow[word] = this.wordRows[i];

    }, this));

  },

  /*
   * Construct and inject a word row.
   *
   * @return void.
   */
  addRow: function() {

    // Build row view.
    var row = new Ov.Views.StackWord();

    // Append and track.
    this.$el.append(row.$el);
    this.wordRows.push(row);

  },

  /*
   * Set the currently selected word instance.
   *
   * @param {String} word: The word.
   *
   * @return void.
   */
  setSelected: function(word) {

    // If the new selected word is different from
    // the current selection.
    if (!_.isNull(this.selected) &&
      this.selected !== word) {

        // Cancel an existing drag on the previous
        // selection and clear out the drag lines.
        this.wordsToRow[this.selected].endDrag();
        Ov.vent.trigger('words:dragCancel');

    }

    this.selected = word;

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

    // If dragging, break.
    if (!Ov.global.isDragging) {

      // Manifest, trigger out.
      Ov.vent.trigger('words:unhover');
      this.$el.removeClass('frozen');
      this.frozen = false;

    }

  },

  /*
   * Empty words.
   *
   * @return void.
   */
  empty: function() {
    this.wordRows = [];
    this.wordsToRow = {};
    this.$el.empty();
  }

});
