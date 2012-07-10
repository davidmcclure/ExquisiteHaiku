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
  Ov.addInitializer(function() {
    Log.Stack = new Ov.Views.Log({ el: '#log' });
  });


  // -------
  // Events.
  // -------

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

  /*
   * Clear the log stacks.
   *
   * @return void.
   */
  Ov.vent.on('state:submit', function(round) {
    Log.Stack.activateSubmit();
  });

  return Log;

})(Backbone, Ov);
