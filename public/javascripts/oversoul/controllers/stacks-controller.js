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
    Stacks.RankStack.empty();
    Stacks.ChurnStack.empty();
    Stacks.RankStack.freeze();
    Stacks.ChurnStack.freeze();
  });

  /*
   * Unfreeze the stacks.
   *
   * @return void.
   */
  Ov.vent.on('state:vote', function() {
    Stacks.RankStack.unFreeze();
    Stacks.ChurnStack.unFreeze();
  });

  /*
   * Apply a word hover.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:hover', function(word) {
    Stacks.RankStack.hover(word);
    Stacks.ChurnStack.hover(word);
  });

  /*
   * Remove a word hover.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:unhover', function(word) {
    Stacks.RankStack.unHover(word);
    Stacks.ChurnStack.unHover(word);
  });

  /*
   * Select a word.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:select', function(word) {

    // Freeze stacks.
    Stacks.RankStack.freeze();
    Stacks.ChurnStack.freeze();

    // Manifest the selection.
    Stacks.RankStack.select(word);
    Stacks.ChurnStack.select(word);

  });

  /*
   * Unhover and deselect a word.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:unselect', function(word) {

    // Unfreeze stacks.
    Stacks.RankStack.unFreeze();
    Stacks.ChurnStack.unFreeze();

    // Remove selection and hover.
    Stacks.RankStack.unHover(word);
    Stacks.ChurnStack.unHover(word);
    Stacks.RankStack.unSelect(word);
    Stacks.ChurnStack.unSelect(word);

  });

  /*
   * Propagate a word drag value.
   *
   * @param {String} word: The word.
   * @param {Number} quantity: The drag quantity.
   *
   * @return void.
   */
  Ov.vent.on('stacks:drag', function(word, quantity) {
    Stacks.RankStack.propagateDrag(word, quantity);
    Stacks.ChurnStack.propagateDrag(word, quantity);
  });

  return Stacks;

})(Backbone, Ov);
