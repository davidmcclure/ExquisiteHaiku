
/**
 * Stack view.
 */

Ov.Views.Stack = Backbone.View.extend({

  /**
   * Prepare trackers.
   */
  initialize: function() {

    // Get components.
    this.window = $(window);

    // Buckets.
    this.wordRows = [];
    this.wordsToRow = {};

    // Trackers.
    this.selected = null;
    this.hovering = false;
    this.frozen = false;

  },

  /**
   * Render stack data.
   *
   * @param {Array} stack: The word data.
   */
  update: function(stack) {

    // Break if frozen.
    if (this.frozen) return;

    // Walk stack words.
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

  /**
   * Construct and inject a word row.
   */
  addRow: function() {

    // Build row view.
    var row = new Ov.Views.StackWord();

    // Append and track.
    this.$el.append(row.$el);
    this.wordRows.push(row);

  },

  /**
   * Set the currently selected word instance.
   *
   * @param {String} word: The word.
   */
  setSelected: function(word) {

    // If the new selected word is different from
    // the current selection.
    if (!_.isNull(this.selected) &&
      this.selected !== word) {

        // Cancel an existing drag on the previous
        // selection and clear out the drag lines.
        this.endCurrentDrag();

    }

    this.selected = word;

  },

  /**
   * Freeze stack rendering.
   */
  freeze: function() {

    // Set trackers.
    this.$el.addClass('frozen');
    this.hovering = true;
    this.frozen = true;

    // Off-stack click.
    this.window.bind({
      'mousedown.cancel': _.bind(function() {
        if (!this.hovering) this.endCurrentDrag();
      }, this)
    });

  },

  /**
   * Unfreeze stack rendering.
   */
  unFreeze: function() {

    this.hovering = false;

    // If dragging, break.
    if (!Ov.global.isDragging) {

      // Unbind off-stack click.
      this.window.unbind('.cancel');

      // Manifest, trigger out.
      Ov.vent.trigger('words:unhover');
      this.$el.removeClass('frozen');
      this.frozen = false;

    }

  },

  /**
   * Cancel the currently running drag.
   */
  endCurrentDrag: function() {
    this.wordsToRow[this.selected].endDrag();
  },

  /**
   * Empty words.
   */
  empty: function() {
    this.wordRows = [];
    this.wordsToRow = {};
    this.selected = null;
    this.$el.empty();
  }

});
