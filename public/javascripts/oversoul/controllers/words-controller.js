/*
 * Word stack controller.
 */

Ov.Controllers.Words = (function(Backbone, Ov) {

  var Words = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate the Words.
   *
   * @return void.
   */
  Ov.addInitializer(function() {
    Words.Stack = new Ov.Views.Words({ el: '#words' });
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
    Words.Stack.update(data.stack);
  });

  /*
   * Freeze and empty the Words.
   *
   * @return void.
   */
  Ov.vent.on('state:submit', function() {
    Words.Stack.hide();
  });

  /*
   * Unfreeze the Words.
   *
   * @return void.
   */
  Ov.vent.on('state:vote', function() {
    Words.Stack.show();
  });

  /*
   * Freeze the Words when a word is selected.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:select', function(word) {
    Words.Stack.freeze();
  });

  /*
   * Unfreeze the Words when a word is unselected.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:unselect', function(word) {
    Words.Stack.unFreeze();
  });

  return Words;

})(Backbone, Ov);
