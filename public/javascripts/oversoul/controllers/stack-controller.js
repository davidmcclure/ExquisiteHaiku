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
    Stack.Stack = new Ov.Views.Stack({ el: '#stack' });
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
    Stack.Stack.update(data.stack);
  });

  /*
   * Freeze and empty the Words.
   *
   * @return void.
   */
  Ov.vent.on('state:submit', function() {
    Stack.Stack.hide();
  });

  /*
   * Unfreeze the Words.
   *
   * @return void.
   */
  Ov.vent.on('state:vote', function() {
    Stack.Stack.show();
  });

  /*
   * Freeze the Words when a word is selected.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('words:select', function(word) {
    Stack.Stack.freeze();
  });

  /*
   * Unfreeze the Words when a word is unselected.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('words:unselect', function(word) {
    Stack.Stack.unFreeze();
  });

  return Stack;

})(Backbone, Ov);
