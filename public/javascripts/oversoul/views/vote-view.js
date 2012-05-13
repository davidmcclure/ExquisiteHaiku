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

    // Create and inject template.
    this.$el.append(this.template()({
      word: this.options.word,
      value: this.options.value
    }));

    // ** dev: render size.
    var size = Math.abs(this.options.value)*0.1;
    this.wordMarkup = this.$el.find('.word');
    this.wordMarkup.css('font-size', size);

  }

});
