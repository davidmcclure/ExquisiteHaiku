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
    Stacks.RankStack = new Ov.Views.Stack({ el: '#rank' });
    Stacks.ChurnStack = new Ov.Views.Stack({ el: '#churn' });
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
    Stacks.RankStack.update(data.stacks.rank);
    Stacks.ChurnStack.update(data.stacks.churn);
  });

  /*
   * Freeze and empty the stacks.
   *
   * @return void.
   */
  Ov.vent.on('state:submit', function() {
    Stacks.RankStack.hide();
    Stacks.ChurnStack.hide();
  });

  /*
   * Unfreeze the stacks.
   *
   * @return void.
   */
  Ov.vent.on('state:vote', function() {
    Stacks.RankStack.show();
    Stacks.ChurnStack.show();
  });

  /*
   * Freeze the stacks when a word is selected.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:select', function(word) {
    Stacks.RankStack.freeze();
    Stacks.ChurnStack.freeze();
  });

  /*
   * Unfreeze the stacks when a word is unselected.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:unselect', function(word) {
    Stacks.RankStack.unFreeze();
    Stacks.ChurnStack.unFreeze();
  });

  return Stacks;

})(Backbone, Ov);
