/*
 * Stacks controller.
 */

Ov.Controllers.Stacks = (function(Backbone, Ov) {

  var Stacks = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate the stacks.
   *
   * @return void.
   */
  Ov.addInitializer(function() {
    Stacks.Stack = new Ov.Views.Stack({ el: '#stack' });
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
    console.log(data.clock);
    Stacks.Stack.update(data.stack);
  });

  /*
   * Freeze and empty the stacks.
   *
   * @return void.
   */
  Ov.vent.on('state:submit', function() {
    Stacks.Stack.hide();
  });

  /*
   * Unfreeze the stacks.
   *
   * @return void.
   */
  Ov.vent.on('state:vote', function() {
    Stacks.Stack.show();
  });

  /*
   * Freeze the stacks when a word is selected.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:select', function(word) {
    Stacks.Stack.freeze();
  });

  /*
   * Unfreeze the stacks when a word is unselected.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:unselect', function(word) {
    Stacks.Stack.unFreeze();
  });

  return Stacks;

})(Backbone, Ov);
