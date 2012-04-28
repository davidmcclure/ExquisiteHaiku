/*
 * View for poem.
 */

var PoemView = Backbone.View.extend({

  /*
   * Markup attributes.
   */
  tagName: 'div',
  className: 'poem',

  /*
   * Event bindings.
   */
  events: {

  },

  /*
   * Append container.
   *
   * @param {Element} container: The container.
   *
   * @return void.
   */
  initialize: function(container) {

    // Build templates.
    this.buildTemplates();

    // Construct blank.
    this.blank = new BlankView();

    // Insert container.
    this.render(container);

  },

  /*
   * Build templates.
   *
   * @return void.
   */
  buildTemplates: function() {

    // Line.
    this.lineTemplate = _.template(
      $('#poem-line').html()
    );

    // Word.
    this.wordTemplate = _.template(
      $('#poem-word').html()
    );

  },

  /*
   * Render the container element.
   *
   * @return void.
   */
  render: function(container) {
    container.append(this.$el);
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

    // Detach blank.
    this.blank.detach();

    // Empty container.
    this.$el.empty();

    // Line array.
    var lines = [];

    // Walk lines.
    _.each(poem, _.bind(function(line) {

      // Insert line.
      var lineMarkup = $(this.lineTemplate());
      this.$el.append(lineMarkup);
      lines.push(lineMarkup);

      // Walk words.
      _.each(line, _.bind(function(word) {

        // Construct word.
        var wordMarkup = $(this.wordTemplate({
          word: word
        }));

        // Insert word.
        lineMarkup.append(wordMarkup);

      }, this));

    }, this));

    // If poem is on first line.
    if (syllables < 5) {

      // If no lines were created.
      if (lines.length === 0) {
        var lineMarkup = $(this.lineTemplate());
        this.$el.append(lineMarkup);
        lines.push(lineMarkup);
      }

      // Append blank.
      this.blank.insert(lines[0]);

    }

    // If poem is on second line.
    else if (syllables >= 5 && syllables < 12) {

      // If only 1 line was created.
      if (lines.length === 1) {
        var lineMarkup = $(this.lineTemplate());
        this.$el.append(lineMarkup);
        lines.push(lineMarkup);
      }

      // Append blank.
      this.blank.insert(lines[1]);

    }

    // If poem is on third line.
    else if (syllables >= 12 && syllables < 17) {

      // If only 2 lines were created.
      if (lines.length === 2) {
        var lineMarkup = $(this.lineTemplate());
        this.$el.append(lineMarkup);
        lines.push(lineMarkup);
      }

      // Append blank.
      this.blank.insert(lines[2]);

    }

  }

});
