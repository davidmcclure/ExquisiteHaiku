/*
 * Round controller.
 */

Ov.Controllers.Round = (function(Backbone, Ov) {

  var Round = {};


  // ---------------
  // Initialization.
  // ---------------

  Ov.addInitializer(function() {

    // Instantiate round collection.
    Round.RoundCollection = new Ov.Collections.Round();

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

    // Try to retrieve a stored round.
    var round = Round.RoundCollection.query({
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

  });

  return Round;

})(Backbone, Ov);
