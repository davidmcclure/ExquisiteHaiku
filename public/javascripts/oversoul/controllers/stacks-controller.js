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

  return Stacks;

})(Backbone, Ov);
