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
    Log.Stack = new Ov.Views.Log();
  });


  // -------
  // Events.
  // -------

  /*
   * Clear the log stacks.
   *
   * @return void.
   */
  Ov.vent.on('state:submit', function(round) {
    Log.Stack.activateSubmit();
  });

  /*
   * Switch the blank into voting mode.
   *
   * @return void.
   */
  Ov.vent.on('state:vote', function() {
    Log.Stack.activateVote();
  });

  /*
   * When an echo is committed, re-freeze the stack.
   *
   * @return void.
   */
  Ov.vent.on('log:echo', function() {
    Log.Stack.freeze();
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

  return Log;

})(Backbone, Ov);
