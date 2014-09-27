/*
 * Log word view.
 */

Ov.Views.LogWord = Backbone.View.extend({

  tagName: 'div',
  className: 'log-row',

  template: function() {
    return _.template($('#log-word').html());
  },

  events: {
    'mouseenter': 'hover',
    'mouseleave': 'unHover',
    'mousedown':  'echo'
  },

  /*
   * Build template, get components.
   *
   * @param {Object} options
   * @return void.
   */
  initialize: function(options) {

    // Set word and value.
    this.word = options.word;
    this.value = options.value;

    // Build template.
    var row = $(this.template()({
      word: this.word,
      value: Math.abs(this.value)
    }));

    // Append contents, get word.
    this.$el.append(row);
    this.wordMarkup = this.$el.find('.word');

    // Render styles.
    this.renderSize();
    this.renderColor();

  },

  /*
   * Render size.
   *
   * @return void.
   */
  renderSize: function() {
    var size = 10 + 0.05*(Math.abs(this.value));
    this.wordMarkup.css('font-size', size);
  },

  /*
   * Render color.
   *
   * @return void.
   */
  renderColor: function() {
    if (this.value > 0) this.$el.addClass('positive');
    else this.$el.addClass('negative');
  },

  /*
   * Render point preview.
   *
   * @return void.
   */
  hover: function() {
    if (!Ov.global.isDragging) {
      Ov.vent.trigger('log:preview', this.word, this.value);
      Ov.vent.trigger('words:hover', this.word);
    }
  },

  /*
   * Cancel point preview.
   *
   * @return void.
   */
  unHover: function() {
    if (!Ov.global.isDragging) Ov.vent.trigger('log:cancel');
    Ov.vent.trigger('words:unHover', this.word);
  },

  /*
   * Release the echo, reapply preview.
   *
   * @return void.
   */
  echo: function() {
    Ov.vent.trigger('points:vote', this.word, this.value);
    Ov.vent.trigger('log:preview', this.word, this.value);
  }

});
