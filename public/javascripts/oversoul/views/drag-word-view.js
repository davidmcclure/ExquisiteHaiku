/*
 * Abstract class for draggable word.
 */

Ov.Views.DragWord = Backbone.View.extend({

  events: {
    'mouseenter .word': 'hover',
    'mousedown .word':  'select'
  },

  // @abstract
  // The word string.
  word: null,

  // @abstract
  // The word element.
  wordMarkup: null,

  // @abstract
  // The current value.
  value: null,

  /*
   * Build template, get components.
   *
   * @return void.
   */
  initialize: function() {
    this.dragTotal = 0;
    this.dragDelta = 0;
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
    $(window).unbind('keydown.drag');
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

    // Broadcast, track.
    Ov.vent.trigger('words:dragStart', this.word);
    Ov._global.isDragging = true;

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

  /*
   * Process drag mouseup.
   *
   * @return void.
   */
  onDragComplete: function() {

    // Unbind mousemove event.
    $(window).unbind('mousemove.drag');
    $(window).unbind('mouseup.drag');

    // Commit drag total.
    this.dragTotal += this.dragDelta;
    this.dragDelta = 0;

    // Broadcast.
    Ov.vent.trigger('words:dragStop');

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

      // Gather the total, end the drag.
      var total = this.dragDelta + this.dragTotal;
      this.endDrag();

      // Broadcast.
      Ov.vent.trigger('words:dragCommit', this.word, total);

    }

    // If the ESC key was pressed.
    else if (event.keyCode == 27) {
      this.endDrag();
      Ov.vent.trigger('words:dragCancel');
    }

  },

  /*
   * Render size.
   *
   * @return void.
   */
  renderSize: function() {
    var size = 18 + 0.05*(Math.abs(this.value));
    this.wordMarkup.css('font-size', size);
  },

  /*
   * Render color.
   *
   * @return void.
   */
  renderColor: function() {
    if (this.value === 0) this.setNeutral();
    else if (this.value > 0) this.setPositive();
    else this.setNegative();
  },

  /*
   * Set 0 churn.
   *
   * @return void.
   */
  setNeutral: function() {
    this.wordMarkup.removeClass('positive');
    this.wordMarkup.removeClass('negative');
  },

  /*
   * Set positive churn.
   *
   * @return void.
   */
  setPositive: function() {
    this.wordMarkup.addClass('positive');
    this.wordMarkup.removeClass('negative');
  },

  /*
   * Set negative churn.
   *
   * @return void.
   */
  setNegative: function() {
    this.wordMarkup.addClass('negative');
    this.wordMarkup.removeClass('positive');
  },

  /*
   * Render hover.
   *
   * @return void.
   */
  hover: function() {
    if (Ov._global.isDragging) return;
    Ov.vent.trigger('words:hover', this.word);
  },

  /*
   * Render selection.
   *
   * @return void.
   */
  select: function(event) {
    Ov.vent.trigger('words:select', this.word);
    this.addDrag(event);
  },

  /*
   * Remove selection.
   *
   * @return void.
   */
  unSelect: function() {
    Ov.vent.trigger('words:unselect');
    this.wordMarkup.removeClass('select');
  },

  /*
   * Reset word after drag.
   *
   * @return void.
   */
  endDrag: function() {

    // Unselect the word.
    this.unSelect();
    this.setDragNeutral();

    // Update trackers, strip events.
    this.dragTotal = 0;
    Ov._global.isDragging = false;
    $(window).unbind('.drag');

  },

  /*
   * Set word color to match positive drag.
   *
   * @return void.
   */
  setDragPositive: function() {
    this.wordMarkup.addClass('positive');
    this.wordMarkup.removeClass('negative');
  },

  /*
   * Set word color to match negative drag.
   *
   * @return void.
   */
  setDragNegative: function() {
    this.wordMarkup.addClass('negative');
    this.wordMarkup.removeClass('positive');
  },

  /*
   * Reset word color.
   *
   * @return void.
   */
  setDragNeutral: function() {
    this.renderColor();
  }

});
