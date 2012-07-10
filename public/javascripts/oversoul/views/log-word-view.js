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
    'mouseenter':       'hover',
    'mouseleave':       'unHover',
    'mousedown .word':  'echo'
  },

  /*
   * Build template, get components.
   *
   * @return void.
   */
  initialize: function() {

    // Build template.
    var row = $(this.template()({
      word: this.options.word,
      value: this.options.value
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
    var size = 9 + Math.abs(this.options.value*0.05);
    this.wordMarkup.css('font-size', size);
  },

  /*
   * Render color.
   *
   * @return void.
   */
  renderColor: function() {

    // Upvote.
    if (this.options.value > 0) {
      this.$el.addClass('positive');
    }

    // Downvote.
    else {
      this.$el.addClass('negative');
    }

  },

  /*
   * Render point preview.
   *
   * @return void.
   */
  hover: function() {
    if (!Ov._global.isDragging) {
      Ov.vent.trigger('log:preview',
        this.options.word,
        this.options.value
      );
    }
  },

  /*
   * Cancel point preview.
   *
   * @return void.
   */
  unHover: function() {
    if (!Ov._global.isDragging) {
      Ov.vent.trigger('log:cancel');
    }
  },

  /*
   * Duplicate the vote.
   *
   * @return void.
   */
  echo: function() {
    Ov.vent.trigger('log:echo',
      this.options.word,
      this.options.value
    );
  }

});
