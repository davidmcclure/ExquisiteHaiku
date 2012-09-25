/*
 * Log controller.
 */

Ov.Controllers.Log = (function(Backbone, Ov) {

  var Log = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate the log view.
   *
   * @return void.
   */
  Log.init = function() {
    Log.Stack = new Ov.Views.Log({ el: '#log' });
  };


  // -------
  // Events.
  // -------

  /*
   * Clear the log stacks.
   *
   * @return void.
   */
  Ov.vent.on('state:newRound', function(round) {
    Log.Stack.clear();
  });

  /*
   * Propagate incoming vote.
   *
   * @param {String} word: The word.
   * @param {Number} quantity: The vote quantity.
   *
   * @return void.
   */
  Ov.vent.on('socket:vote:in', function(word, quantity) {
    Log.Stack.add(word, quantity);
  });


  // Export.
  Ov.addInitializer(function() { Log.init(); });
  return Log;

})(Backbone, Ov);
