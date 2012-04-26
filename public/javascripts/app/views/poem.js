/*
 * View for poem.
 */

var PoemView = Backbone.View.extend({

  /*
   * The container markup.
   */
  tagName: 'div',

  /*
   * The container class.
   */
  className: 'poem',

  /*
   * Line template.
   */
  lineTemplate: function() {
    _.template($('#poem-line').html());
  },

  /*
   * Word template.
   */
  wordTemplate: function() {
    _.template($('#poem-word').html());
  },

  /*
   * Bind events.
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

    // Insert container.
    this.render(container);

    // Construct blank.
    this.blank = new BlankView();

  },

  /*
   * Render the container element.
   *
   * @return void.
   */
  render: function(container) {
    $('.left').append(this.$el);
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
    this.blank.el.detach();

    // Empty container.
    this.el.empty();

    // Walk lines.
    _.each(poem, _.bind(function(line) {

      // Insert line.
      var lineTemplate = this.lineTemplate();
      this.el.append(lineTemplate());

      // Walk words.
      _.each(line, function(word) {

        // Insert word.
        var wordTemplate = this.wordTemplate();
        lineTemplate.append(wordTemplate({
          word: word
        }));

      });

    }), this);

    // Reposition blank.

  }

});
