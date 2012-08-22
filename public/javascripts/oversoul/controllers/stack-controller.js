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
    Stack.Line.clear();
  });

  /*
   * Freeze the words when a word is selected.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('words:select', function(word) {
    Stack.Rank.setSelected(word);
    Stack.Rank.freeze();
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
      Stack.Line.render(initEvent, dragEvent, currentTotal);
  });

  /*
   * When a drag is committed or cancelled.
   *
   * @return void.
   */
  Ov.vent.on('words:dragCancel', function() {
    Stack.Rank.unFreeze();
    Stack.Line.hide();
  });

  /*
   * Unfreeze the stacks after a vote.
   *
   * @return void.
   */
  Ov.vent.on('points:releaseVote', function() {
    Stack.Rank.setSelected(null);
    Stack.Rank.unFreeze();
    Stack.Line.hide();
  });

  /*
   * Insufficient points for current drag quantity.
   *
   * @return void.
   */
  Ov.vent.on('points:invalid', function() {
    Stack.Line.setInvalid();
  });

  return Stack;

})(Backbone, Ov);
