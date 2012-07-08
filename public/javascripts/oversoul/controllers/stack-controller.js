/*
 * Word stack controller.
 */

Ov.Controllers.Stack = (function(Backbone, Ov) {

  var Stack = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate the stack view.
   *
   * @return void.
   */
  Ov.addInitializer(function() {
    Stack.Rank = new Ov.Views.Stack({ el: '#stack' });
    Stack.Line = new Ov.Views.Line();
  });


  // -------
  // Events.
  // -------

  /*
   * Propagate incoming stack data.
   *
   * @param {Object} data: The incoming slice data.
   *
   * @return void.
   */
  Ov.vent.on('socket:slice', function(data) {
    Stack.Rank.update(data.stack);
  });

  /*
   * Freeze and empty the words.
   *
   * @return void.
   */
  Ov.vent.on('state:submit', function() {
    Stack.Rank.hide();
  });

  /*
   * Unfreeze the words.
   *
   * @return void.
   */
  Ov.vent.on('state:vote', function() {
    Stack.Rank.show();
  });

  /*
   * Freeze the words when a word is selected.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('words:select', function(word) {
    Stack.Rank.freeze();
  });

  /*
   * Unfreeze the words when a word is unselected.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('words:unselect', function(word) {
    Stack.Rank.unFreeze();
  });

  /*
   * When a drag is started.
   *
   * @param {String} word: The clicked word.
   *
   * @return void.
   */
  Ov.vent.on('words:dragStart', function(word) {
    Stack.Line.show();
  });

  /*
   * When an individual drag is completed.
   *
   * @return void.
   */
  Ov.vent.on('words:dragStop', function() {
    Stack.Line.lockCurrent();
  });

  /*
   * When a drag is committed or cancelled.
   *
   * @return void.
   */
  Ov.vent.on('words:dragEnd', function() {
    Stack.Line.hide();
  });

  /*
   * Render drag line and quantity preview.
   *
   * @param {String} word: The word being dragged on.
   * @param {Number} currenTotal: The current drag quantity.
   * @param {Object} initEvent: The initiating click event.
   * @param {Object} dragEvent: The current mousemove event.
   *
   * @return void.
   */
  Ov.vent.on('words:dragTick', function(
    word, currentTotal, initEvent, dragEvent) {

      // Render line.
      Stack.Line.render(initEvent, dragEvent);

  });

  return Stack;

})(Backbone, Ov);
