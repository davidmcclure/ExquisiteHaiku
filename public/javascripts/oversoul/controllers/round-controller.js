/*
 * Round controller.
 */

Ov.Controllers.Round = (function(Backbone, Ov) {

  var Round = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate round collection.
   *
   * @return void.
   */
  Ov.addInitializer(function() {
    Round.RoundCollection = new Ov.Collections.Round();
    Round.RoundCollection.fetch();
  });


  // -------
  // Events.
  // -------

  /*
   * Process the incoming round id and emit the current
   * application state.
   *
   * @param {Object} data: The incoming slice data.
   *
   * @return void.
   */
  Ov.vent.on('socket:slice', function(data) {

    // Try to retrieve a stored round.
    var round = Round.RoundCollection.where({
      round: data.round
    });

    // If the user has not voted on the current round,
    // raise the state:submit event.
    if (_.isEmpty(round)) {
      Ov.vent.trigger('state:submit');
    }

    // If the user has voted on the current round, raise
    // the state:vote event.
    else {
      Ov.vent.trigger('state:vote');
    }

    // Store the current round id as a top-level
    // attribute on the round collection.
    Round.RoundCollection.currentRound = data.round;

  });

  /*
   * When words are submitted, store the current round id
   * in the list of rounds that have been submitted.
   *
   * @return void.
   */
  Ov.vent.on('socket:submit', function(data) {
    Round.RoundCollection.recordSubmission();
  });

  return Round;

})(Backbone, Ov);
