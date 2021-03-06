
/**
 * Word stack controller.
 */

Ov.Controllers.Stack = (function(Backbone, Ov) {

  var Stack = {};


  // ---------------
  // Initialization.
  // ---------------

  /**
   * Instantiate the stack view.
   */
  Stack.init = function() {
    Stack.Rank = new Ov.Views.Stack({ el: '#stack' });
    Stack.Drag = new Ov.Views.Drag();
  };


  // -------
  // Events.
  // -------

  /**
   * Propagate incoming stack data.
   *
   * @param {Object} data: The incoming slice data.
   */
  Ov.vent.on('socket:slice', function(data) {
    if (!Ov.global.isDragging) Stack.Rank.update(data.stack);
  });

  /**
   * Empty the stack, clear the drag line.
   */
  Ov.vent.on('state:newRound', function() {
    Stack.Rank.empty();
    Stack.Drag.clear();
  });

  /**
   * Freeze the stack.
   */
  Ov.vent.on('stack:freeze', function() {
    Stack.Rank.freeze();
  });

  /**
   * Unfreeze the stack.
   */
  Ov.vent.on('words:unHover', function() {
    Stack.Rank.unFreeze();
  });

  /**
   * Freeze the words when a word is selected.
   *
   * @param {String} word: The hovered word.
   */
  Ov.vent.on('words:select', function(word) {
    Stack.Rank.setSelected(word);
    Stack.Rank.freeze();
  });

  /**
   * When a drag is started.
   *
   * @param {String} word: The clicked word.
   */
  Ov.vent.on('words:dragStart', function(word) {
    Stack.Drag.show();
  });

  /**
   * When an individual drag is completed.
   */
  Ov.vent.on('words:dragStop', function() {
    Stack.Drag.lockCurrent();
  });

  /**
   * Render drag line and quantity preview.
   *
   * @param {String} word: The word being dragged on.
   * @param {Number} currenTotal: The current drag quantity.
   * @param {Object} initEvent: The initiating click event.
   * @param {Object} dragEvent: The current mousemove event.
   */
  Ov.vent.on('words:dragTick', function(
    word, currentTotal, initEvent, dragEvent) {
      Stack.Drag.render(initEvent, dragEvent, currentTotal);
  });

  /**
   * When a drag is committed or cancelled.
   */
  Ov.vent.on('words:dragCancel', function() {
    Stack.Rank.unFreeze();
    Stack.Drag.hide();
  });

  /**
   * Unfreeze the stacks after a vote.
   */
  Ov.vent.on('points:vote', function() {
    Stack.Rank.setSelected(null);
    Stack.Rank.unFreeze();
    Stack.Drag.hide();
  });


  // Export.
  Ov.addInitializer(function() { Stack.init(); });
  return Stack;

})(Backbone, Ov);
