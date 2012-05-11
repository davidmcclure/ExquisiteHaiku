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
    'mouseenter .stack-word':   'hover',
    'mouseleave .stack-word':   'unHover',
    'mousedown .stack-word':    'select'
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
   * Bind drag listener.
   *
   * @param {Object} event: The mousedown event.
   *
   * @return void.
   */
  addDrag: function(event) {

    // Reset listeners.
    $(window).unbind('keydown');
    var total = 0; var delta = 0;

    $(window).bind({

      // Drag.
      'mousemove': _.bind(function(e) {
        delta = event.pageY - e.pageY;
        Ov.vent.trigger('stacks:drag', this.word, total + delta);
      }, this),

      // Release.
      'mouseup': _.bind(function() {
        $(window).unbind('mousemove');
        total += delta;
      }, this),

      // Spacebar.
      'keydown': _.bind(function(e) {
        if (e.keyCode == 32) {
          Ov.vent.trigger('socket:vote', this.word, total);
          $(window).unbind('mouseup keydown');
          this.unSelect();
        }
      }, this)

    });

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
    Ov.vent.trigger('stacks:select');
    this.wordMarkup.addClass('select');
    this.addDrag(event);
  },

  /*
   * Remove selection.
   *
   * @return void.
   */
  unSelect: function() {
    Ov.vent.trigger('stacks:unselect');
    this.wordMarkup.removeClass('select');
  }

});
