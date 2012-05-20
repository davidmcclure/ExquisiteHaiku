/*
 * Vote stack controller.
 */

Ov.Controllers.Votes = (function(Backbone, Ov) {

  var Votes = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate the vote stack.
   *
   * @return void.
   */
  Ov.addInitializer(function() {
    Votes.Stack = new Ov.Views.Votes({ el: '#votes' });
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
    Votes.Stack.add(word, quantity);
  });

  /*
   * Hide the votes.
   *
   * @return void.
   */
  Ov.vent.on('state:submit', function() {
    Votes.Stack.hide();
  });

  /*
   * Show the votes.
   *
   * @return void.
   */
  Ov.vent.on('state:vote', function() {
    Votes.Stack.show();
  });

  return Votes;

})(Backbone, Ov);
