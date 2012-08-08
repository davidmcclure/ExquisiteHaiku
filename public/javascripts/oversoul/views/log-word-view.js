/*
 * Log word view.
 */

Ov.Views.LogWord = Ov.Views.DragWord.extend({

  tagName: 'div',
  className: 'log-row',

  template: function() {
    return _.template($('#log-word').html());
  },

  /*
   * Build template, get components.
   *
   * @return void.
   */
  initialize: function() {

    // Call parent.initialize().
    Ov.Views.DragWord.prototype.initialize.call(this);

    // Set word and value.
    this.word = this.options.word;
    this.value = this.options.value;

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
   * Process drag mouseup.
   *
   * @return void.
   */
  onDragComplete: function() {
    Ov.Views.DragWord.prototype.onDragComplete.call(this);
    if (this.dragTotal === 0) this.echo();
  },

  /*
   * Set positive.
   *
   * @return void.
   */
  setPositive: function() {
    Ov.Views.DragWord.prototype.setPositive.call(this);
    this.$el.addClass('positive');
    this.$el.removeClass('negative');
  },

  /*
   * Set negative.
   *
   * @return void.
   */
  setNegative: function() {
    Ov.Views.DragWord.prototype.setNegative.call(this);
    this.$el.addClass('negative');
    this.$el.removeClass('positive');
  },

  /*
   * Duplicate the vote.
   *
   * @return void.
   */
  echo: function() {
    Ov.vent.trigger('log:echo',
      this.word,
      this.value
    );
  }

});
