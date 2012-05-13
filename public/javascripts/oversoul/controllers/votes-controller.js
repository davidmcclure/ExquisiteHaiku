/*
 * Votes controller.
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
    Votes.Votes = new Ov.Views.Votes({ el: '#votes' });
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
    Votes.Votes.add(word, quantity);
  });

  /*
   * Freeze and empty the stack.
   *
   * @return void.
   */
  Ov.vent.on('state:submit', function() {

  });

  /*
   * Unfreeze the stack.
   *
   * @return void.
   */
  Ov.vent.on('state:vote', function() {

  });

  return Votes;

})(Backbone, Ov);
