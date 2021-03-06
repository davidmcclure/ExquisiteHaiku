
/**
 * Stack word view.
 */

Ov.Views.StackWord = Backbone.View.extend({

  tagName: 'div',
  className: 'stack-row',

  template: function() {
    return _.template($('#stack-word').html());
  },

  events: {
    'mouseenter': 'hover',
    'mouseleave': 'unHover',
    'mousedown':  'select'
  },

  /**
   * Build template, get components.
   */
  initialize: function() {

    // Inject template.
    this.$el.append(this.template()());

    // Get components.
    this.window = $(window);
    this.posChurnMarkup = this.$el.find('.churn.pos');
    this.negChurnMarkup = this.$el.find('.churn.neg');
    this.ratioMarkup = this.$el.find('.ratio');
    this.wordMarkup = this.$el.find('.word');

    // Trackers.
    this.word = null;
    this.posChurn = null;
    this.negChurn = null;
    this.churn = null;
    this.ratio = null;
    this.dragTotal = 0;
    this.dragDelta = 0;

  },

  /**
   * Render new values, set word tracker.
   *
   * @param {Array} data: Array of [word, value].
   */
  update: function(data) {

    // Capture data.
    this.word = data[0];
    this.posChurn = data[2];
    this.negChurn = data[3];
    this.ratio = data[4];

    // Compute aggregate churn.
    this.churn = this.posChurn + this.negChurn;

    // Render values.
    this.wordMarkup.text(this.word);
    this.posChurnMarkup.text(this.posChurn);
    this.negChurnMarkup.text(Math.abs(this.negChurn));
    this.ratioMarkup.text(this.ratio);

    // Render styles.
    this.renderSize();
    this.renderColor();

  },

  /**
   * Bind drag listener.
   *
   * @param {Object} event: The mousedown event.
   */
  addDrag: function(event) {

    // Reset listeners and trackers.
    this.window.unbind('keydown.drag');
    this.dragDelta = 0;

    this.window.bind({

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

    // Broadcast, track.
    Ov.vent.trigger('words:dragStart', this.word);
    Ov.global.isDragging = true;

  },

  /**
   * Process drag mousemove.
   *
   * @param {Object} initEvent: The initiating click event.
   * @param {Object} dragEvent: The current mousemove event.
   */
  onDragTick: function(initEvent, dragEvent) {

    // Compute drag delta.
    var deltaX = initEvent.pageX - dragEvent.pageX;
    var deltaY = initEvent.pageY - dragEvent.pageY;
    var x2 = Math.pow(deltaX, 2);
    var y2 = Math.pow(deltaY, 2);
    this.dragDelta = Math.round(Math.sqrt(x2 + y2));
    if (deltaY < 0) { this.dragDelta *= -1; }

    // Get current total.
    var currentTotal = this.dragDelta + this.dragTotal;

    // Set word color.
    if (currentTotal >= 0) this.setDragPositive();
    else this.setDragNegative();

    // Broadcast the drag tick.
    Ov.vent.trigger('words:dragTick',
      this.word,
      currentTotal,
      initEvent,
      dragEvent
    );

  },

  /**
   * Process drag mouseup.
   */
  onDragComplete: function() {

    // Unbind mousemove event.
    this.window.unbind('mousemove.drag');
    this.window.unbind('mouseup.drag');

    // Commit drag total.
    this.dragTotal += this.dragDelta;
    this.dragDelta = 0;

    // Broadcast.
    Ov.vent.trigger('words:dragStop');

  },

  /**
   * Process drag keydown.
   *
   * @param {Object} event: The keydown event.
   */
  onDragKeydown: function(event) {

    // If the spacebar was pressed.
    if (event.keyCode == 32) {

      // Suppress scrolling.
      event.preventDefault();

      // Gather total, end drag.
      var total = this.dragDelta + this.dragTotal;
      this.endDrag();

      // Release if not 0.
      if (total !== 0) {
        Ov.vent.trigger('points:vote', this.word, total);
      }

    }

    // If the ESC key was pressed.
    else if (event.keyCode == 27) {
      this.endDrag();
    }

  },

  /**
   * Render size.
   */
  renderSize: function() {
    var size = 18 + 0.05*(Math.abs(this.churn));
    this.wordMarkup.css('font-size', size);
  },

  /**
   * Render color.
   */
  renderColor: function() {
    if (this.churn === 0) this.setNeutral();
    else if (this.churn > 0) this.setPositive();
    else this.setNegative();
  },

  /**
   * Render hover.
   */
  hover: function() {
    Ov.vent.trigger('words:hover', this.word);
    Ov.vent.trigger('stack:freeze', this.word);
  },

  /**
   * Emit unHover.
   */
  unHover: function() {
    Ov.vent.trigger('words:unHover', this.word);
  },

  /**
   * Render selection.
   */
  select: function(event) {
    Ov.vent.trigger('words:select', this.word);
    this.addDrag(event);
  },

  /**
   * Remove selection.
   */
  unSelect: function() {
    Ov.vent.trigger('words:unselect');
  },

  /**
   * Reset word after drag.
   */
  endDrag: function() {

    // Unselect.
    this.unSelect();
    this.setDragNeutral();

    // Untrack and unbind.
    this.dragTotal = 0;
    Ov.global.isDragging = false;
    this.window.unbind('.drag');
    Ov.vent.trigger('words:dragCancel');

  },

  /**
   * Set 0 churn.
   */
  setNeutral: function() {
    this.wordMarkup.removeClass('positive');
    this.wordMarkup.removeClass('negative');
  },

  /**
   * Set positive churn.
   */
  setPositive: function() {
    this.wordMarkup.addClass('positive');
    this.wordMarkup.removeClass('negative');
  },

  /**
   * Set negative churn.
   */
  setNegative: function() {
    this.wordMarkup.addClass('negative');
    this.wordMarkup.removeClass('positive');
  },

  /**
   * Set word color to match positive drag.
   */
  setDragPositive: function() {
    this.wordMarkup.addClass('positive');
    this.wordMarkup.removeClass('negative');
  },

  /**
   * Set word color to match negative drag.
   */
  setDragNegative: function() {
    this.wordMarkup.addClass('negative');
    this.wordMarkup.removeClass('positive');
  },

  /**
   * Reset word color.
   */
  setDragNeutral: function() {
    this.renderColor();
  }

});
