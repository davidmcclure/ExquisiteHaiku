/*
 * Stack word view.
 */

Ov.Views.StackWord = Backbone.View.extend({

  events: {
    'mousedown': 'addDrag'
  },

  /*
   * Build template, get components.
   *
   * @return void.
   */
  initialize: function() {

    // Trackers.
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
      this.options.word,
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
      Ov.vent.trigger('words:dragCommit',
        this.options.word, total);

    }

    // If the ESC key was pressed.
    else if (event.keyCode == 27) {
      this.endDrag();
      Ov.vent.trigger('words:dragCancel');
    }

  }

});
