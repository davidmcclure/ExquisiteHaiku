/*
 * Word view.
 */

Ov.Views.Word = Backbone.View.extend({

  tagName: 'tr',
  className: 'stack-row',

  template: function() {
    return _.template($('#stack-word').html());
  },

  events: {
    'mouseenter .stack-word':   'onHover',
    'mouseleave .stack-word':   'onUnHover',
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
    this.quantity = 0;

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
   * Bind drag listener.
   *
   * @param {Object} event: The mousedown event.
   *
   * @return void.
   */
  addDrag: function(event) {

    // Reset listeners.
    $(window).unbind('keydown');

    // Capture starting quantity.
    var quantity = this.quantity;
    var total = 0;

    $(window).bind({

      // Drag.
      'mousemove': _.bind(function(e) {
        var deltaY = event.pageY - e.pageY;
        total = quantity + deltaY;
        Ov.vent.trigger('stacks:drag', this.word, total);
      }, this),

      // Release.
      'mouseup': _.bind(function() {
        $(window).unbind('mousemove');
      }, this),

      // Enter.
      'keydown': _.bind(function(e) {
        $(window).unbind('mousemove');
        if (e.keyCode == 13) {
          Ov.vent.trigger('socket:vote', this.word, total);
          Ov.vent.trigger('stacks:unselect', this.word);
        }
      }, this)

    });

  },

  /*
   * Remove drag listener.
   *
   * @return void.
   */
  removeDrag: function() {

  },

  /*
   * On hover on the word text.
   *
   * @return void.
   */
  onHover: function() {
    Ov.vent.trigger('stacks:hover', this.word);
  },

  /*
   * On unhover on the word text.
   *
   * @return void.
   */
  onUnHover: function() {
    Ov.vent.trigger('stacks:unhover', this.word);
  },

  /*
   * On click on the word text.
   *
   * @param {Object} event: The mousedown event.
   *
   * @return void.
   */
  onSelect: function(event) {
    Ov.vent.trigger('stacks:unhover', this.word);
    Ov.vent.trigger('stacks:select', this.word);
    this.addDrag(event);
  },

  /*
   * On clickout from selection.
   *
   * @return void.
   */
  onUnSelect: function() {
    Ov.vent.trigger('stacks:unselect', this.word);
    this.removeDrag();
  },

  /*
   * Render hover.
   *
   * @return void.
   */
  hover: function() {
    this.wordMarkup.addClass('hover');
  },

  /*
   * Remove hover.
   *
   * @return void.
   */
  unHover: function() {
    this.wordMarkup.removeClass('hover');
  },

  /*
   * Render selection.
   *
   * @return void.
   */
  select: function() {
    this.wordMarkup.addClass('select');
  },

  /*
   * Remove selection.
   *
   * @return void.
   */
  unSelect: function() {
    this.wordMarkup.removeClass('select');
  }

});
