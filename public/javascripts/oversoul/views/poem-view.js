/*
 * Poem view.
 */

Ov.Views.Poem = Backbone.View.extend({

  el: '#poem',

  lineTemplate: function() {
    return _.template($('#poem-line').html());
  },

  wordTemplate: function() {
    return _.template($('#poem-word').html());
  },

  /*
   * Prepare trackers.
   *
   * @return void.
   */
  initialize: function() {

    // Templates.
    this.__line = this.lineTemplate();
    this.__word = this.wordTemplate();

    // Trackers.
    this.lines = [];

  },

  /*
   * Render poem words.
   *
   * @param {Array} poem: The poem.
   * @param {Number} syllables: The current syllable count.
   *
   * @return void.
   */
  update: function(poem, syllables) {

    // Before render hook.
    Ov.vent.trigger('poem:render:before');
    var lastLine;

    // Empty container.
    this.$el.empty();
    this.lines = [];

    // Walk lines.
    _.each(poem, _.bind(function(line) {

      // Insert line.
      var newLine = this.addLine();

      // Walk words.
      _.each(line, _.bind(function(word) {
        var wordMarkup = $(this.__word({ word: word }));
        newLine.append(wordMarkup);
      }, this));

    }, this));

    // If poem is on first line.
    if (syllables < 5) {
      if (this.lines.length === 0) this.addLine();
      lastLine = this.lines[0];
    }

    // If poem is on second line.
    else if (syllables >= 5 && syllables < 12) {
      if (this.lines.length === 1) this.addLine();
      lastLine = this.lines[1];
    }

    // If poem is on third line.
    else if (syllables >= 12 && syllables <= 17) {
      if (this.lines.length === 2) this.addLine();
      lastLine = this.lines[2];
    }

    // Append blank.
    Ov.vent.trigger('poem:render:after', lastLine);

  },

  /*
   * Add a new line to the container.
   *
   * @return {Element} line: The new line.
   */
  addLine: function() {

    // Build markup.
    var line = $(this.__line());
    this.$el.append(line);

    // Update tracker.
    this.lines.push(line);

    return line;

  }

});
