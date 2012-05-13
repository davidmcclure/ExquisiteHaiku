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
    'mouseenter .word':   'hover',
    'mouseleave .word':   'unHover',
    'mousedown .word':    'select'
  },

  /*
   * Build template, get components.
   *
   * @return void.
   */
  initialize: function() {

    // Inject template.
    this.$el.append(this.template()());

    // Get components.
    this.churnMarkup = this.$el.find('.churn');
    this.ratioMarkup = this.$el.find('.ratio');
    this.wordMarkup = this.$el.find('.word');

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

    // Render values.
    this.wordMarkup.text(data[0]);
    this.ratioMarkup.text(data[3]);
    this.churnMarkup.text(data[2]);
    this.word = data[0];

    // If churn 0.
    if (data[2] === 0) {
      this.setNeutral();
    }

    // If churn > 0.
    else if (data[2] > 0) {
      this.setPositive();
    }

    // If churn < 0.
    else {
      this.setNegative();
    }

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
    if (event.keyCode == 32) {

      // Suppress scrolling.
      event.preventDefault();

      // Strip events, unselect.
      $(window).unbind('mouseup.drag keydown.drag');
      this.unSelect();

      // Broadcast the vote.
      var total = this.dragDelta + this.dragTotal;
      Ov.vent.trigger('socket:vote:out', this.word, total);

    }

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
  select: function(event) {
    Ov.vent.trigger('stacks:select');
    this.wordMarkup.addClass('select');
    this.addDrag(event);
    this.unHover();
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
   * Set 0 churn.
   *
   * @return void.
   */
  setNeutral: function() {
    this.churnMarkup.removeClass('positive');
    this.churnMarkup.removeClass('negative');
  },

  /*
   * Set positive churn.
   *
   * @return void.
   */
  setPositive: function() {
    this.churnMarkup.addClass('positive');
    this.churnMarkup.removeClass('negative');
  },

  /*
   * Set negative churn.
   *
   * @return void.
   */
  setNegative: function() {
    this.churnMarkup.addClass('negative');
    this.churnMarkup.removeClass('positive');
  }

});
