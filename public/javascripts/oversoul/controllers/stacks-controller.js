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
   * Add highlight to stack word.
   *
   * @param {String} word: The highlighted word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:highlight', function(word) {

    // Manifest the highlight on all stacks.
    Stacks.RankStack.highlight(word);
    Stacks.ChurnStack.highlight(word);

  });

  /*
   * Remove highlight from stack word.
   *
   * @param {String} word: The highlighted word.
   *
   * @return void.
   */
  Ov.vent.on('stacks:unhighlight', function(word) {

    // Manifest the highlight on all stacks.
    Stacks.RankStack.unHighlight(word);
    Stacks.ChurnStack.unHighlight(word);

  });

  return Stacks;

})(Backbone, Ov);
