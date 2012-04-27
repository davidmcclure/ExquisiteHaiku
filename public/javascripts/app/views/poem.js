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
   *
   * @return void.
   */
  update: function(poem) {

    // Detach blank.
    this.blank.detach();

    // Empty container.
    this.$el.empty();

    // Walk lines.
    _.each(poem, _.bind(function(line) {

      // Insert line.
      var lineMarkup = $(this.lineTemplate());
      this.$el.append(lineMarkup);

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

    // Reposition blank.
    // this.blank.insert(line);

  }

});
