/*
 * Word view.
 */

Ov.Views.Word = Backbone.View.extend({

  tagName: 'tr',
  className: 'stack-word',

  template: function() {
    return _.template($('#stack-word').html());
  },

  events: {
    'mouseenter .stack-word':   'onHighlight',
    'mousedown .stack-word':    'onSelect'
  },

  /*
   * Build template, get components.
   *
   * @return void.
   */
  initialize: function() {

    // Inject template.
    this.$el.append(this.template()());

    // Get components
    this.valueMarkup = this.$el.find('.stack-value');
    this.wordMarkup = this.$el.find('.stack-word');

    // Trackers.
    this.word = null;

  },

  /*
   * Render new values, set word tracker.
   *
   * @param {Array} data: Array of [word, value].
   *
   * @return void.
   */
  update: function(data) {
    this.wordMarkup.text(data[0]);
    this.valueMarkup.text(data[1]);
    this.word = data[0];
  },

  /*
   * On hover on the word text.
   *
   * @return void.
   */
  onHighlight: function() {
    Ov.vent.trigger('stacks:highlight', this.word);
  },

  /*
   * On click on the word text.
   *
   * @return void.
   */
  onSelect: function() {
    Ov.vent.trigger('stacks:select', this.word);
  }

});

