/*
 * Stack word view.
 */

Ov.Views.StackWord = Backbone.View.extend({

  tagName: 'tr',
  className: 'stack-row',

  template: function() {
    return _.template($('#stack-word').html());
  },

  events: {
    'mouseenter .word':   'hover',
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
    this.churn = null;
    this.ratio = null;
    this.dragTotal = 0;
    this.dragDelta = 0;

    // Track dragging globally.
    Ov._global.isDragging = false;

  },

  /*
   * Render new values, set word tracker.
   *
   * @param {Array} data: Array of [word, value].
   *
   * @return void.
   */
  update: function(data) {

    // Capture data.
    this.word = data[0];
    this.churn = data[2];
    this.ratio = data[3];

    // Render values.
    this.wordMarkup.text(data[0]);
    this.ratioMarkup.text(data[3]);
    this.churnMarkup.text(data[2]);

    // Render styles.
    this.renderSize();
    this.renderColor();

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
    var size = 18 + 0.05*(Math.abs(this.churn));
    this.wordMarkup.css('font-size', size);
  },

  /*
   * Render color.
   *
   * @return void.
   */
  renderColor: function() {
    if (this.churn === 0) this.setNeutral();
    else if (this.churn > 0) this.setPositive();
    else this.setNegative();
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
    this.unSelect();
    this.setDragNeutral();
    this.dragTotal = 0;
    Ov._global.isDragging = false;
    $(window).unbind('.drag');
  },

  /*
   * Set 0 churn.
   *
   * @return void.
   */
  setNeutral: function() {
    this.churnMarkup.removeClass('positive');
    this.churnMarkup.removeClass('negative');
    this.wordMarkup.removeClass('positive');
    this.wordMarkup.removeClass('negative');
  },

  /*
   * Set positive churn.
   *
   * @return void.
   */
  setPositive: function() {
    this.churnMarkup.addClass('positive');
    this.churnMarkup.removeClass('negative');
    this.wordMarkup.addClass('positive');
    this.wordMarkup.removeClass('negative');
  },

  /*
   * Set negative churn.
   *
   * @return void.
   */
  setNegative: function() {
    this.churnMarkup.addClass('negative');
    this.churnMarkup.removeClass('positive');
    this.wordMarkup.addClass('negative');
    this.wordMarkup.removeClass('positive');
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
