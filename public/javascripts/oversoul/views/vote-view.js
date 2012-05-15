/*
 * Vote view.
 */

Ov.Views.Vote = Backbone.View.extend({

  tagName: 'div',
  className: 'vote-row',

  template: function() {
    return _.template($('#vote-word').html());
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

    // On click, reapply vote.
    this.wordMarkup.mousedown(_.bind(function() {
      Ov.vent.trigger(
        'socket:vote:out',
        this.options.word,
        this.options.value
      );
    }, this));

  },

  /*
   * Render size.
   *
   * @return void.
   */
  renderSize: function() {
    var size = 9 + Math.abs(this.options.value*0.02);
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

  }

});
