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
    this.dragTotal = 0;
    this.dragDelta = 0;

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

    // Reset listeners and trackers.
    $(window).unbind('keydown');
    this.dragTotal = 0;
    this.dragDelta = 0;

    $(window).bind({

      'mousemove.drag': _.bind(function(e) {
        this.onDragTick(event, e);
      }, this),

      'mouseup.drag': _.bind(function() {
        this.onDragComplete();
      }, this),

      'keydown.drag': _.bind(function(e) {
        this.onDragKeydown(e);
      }, this)

    });

  },

  /*
   * Render hover.
   *
   * @return void.
   */
  hover: function() {
    Ov.vent.trigger('stacks:hover', this.word);
    this.wordMarkup.addClass('hover');
  },

  /*
   * Remove hover.
   *
   * @return void.
   */
  unHover: function() {
    Ov.vent.trigger('stacks:unhover', this.word);
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
  },

  /*
   * Process drag mousemove.
   *
   * @param {Object} initEvent: The initiating click event.
   * @param {Object} dragEvent: The current mousemove event.
   *
   * @return void.
   */
  onDragTick: function(initEvent, dragEvent) {

    // Get drag delta and current drag total.
    this.dragDelta = initEvent.pageY - dragEvent.pageY;
    var currentTotal = this.dragDelta + this.dragTotal;

    // Broadcast the drag tick.
    Ov.vent.trigger('stacks:drag', this.word, currentTotal);

  },

  /*
   * Process drag mouseup.
   *
   * @return void.
   */
  onDragComplete: function() {

    // Unbind mousemove event.
    $(window).unbind('mousemove.drag');

    // Commit drag total.
    this.dragTotal += this.dragDelta;

  },

  /*
   * Process drag keydown.
   *
   * @param {Object} event: The keydown event.
   *
   * @return void.
   */
  onDragKeydown: function(event) {

    // If the spacebar was pressed.
    if (e.keyCode == 32) {

      // Strip events, unselect.
      $(window).unbind('mouseup.drag keydown.drag');
      this.unSelect();

      // Broadcast the vote.
      Ov.vent.trigger('socket:vote', this.word, total);

    }

  }

});
