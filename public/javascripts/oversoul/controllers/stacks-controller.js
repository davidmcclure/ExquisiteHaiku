/*
 * Stacks controller.
 */

Ov.Controllers.Stacks = (function(Backbone, Ov) {

  var Stacks = {};


  // ---------------
  // Initialization.
  // ---------------

  Ov.addInitializer(function() {

    // Instantiate the stacks.
    Stacks.RankStack = new Ov.Views.Stack({ el: '#rank' });
    Stacks.ChurnStack = new Ov.Views.Stack({ el: '#churn' });

  });


  // -------
  // Events.
  // -------

  /*
   * On incoming data slice.
   *
   * @param {Object} data: The incoming slice data.
   *
   * @return void.
   */
  Ov.vent.on('socket:slice', function(data) {

    // Render the new stack data.
    Stacks.RankStack.update(data.stacks.rank);
    Stacks.ChurnStack.update(data.stacks.churn);

  });

  /*
   * Add hover to stack word.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:hover', function(word) {

    // Manifest the highlight on all stacks.
    Stacks.RankStack.hover(word);
    Stacks.ChurnStack.hover(word);

  });

  /*
   * Remove hover from stack word.
   *
   * @param {String} word: The hovered word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:unhover', function(word) {

    // Manifest the highlight on all stacks.
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

    // Manifest the highlight on all stacks.
    Stacks.RankStack.select(word);
    Stacks.ChurnStack.select(word);

  });

  return Stacks;

})(Backbone, Ov);
