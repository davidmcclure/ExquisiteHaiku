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
    var round = Round.RoundCollection.get(data.round);

    // // Vote -> submit.
    // if (_.isEmpty(round) && Ov.global.isVoting) {
    //   Ov.vent.trigger('state:submit');
    //   Ov.global.isVoting = false;
    // }

    // // Submit -> vote.
    // else if (!Ov.global.isVoting) {
    //   Ov.vent.trigger('state:vote', round);
    //   Ov.global.isVoting = true;
    // }

    // Store the current round.
    Round.RoundCollection.currentRound = data.round;

  });

  /*
   * When words are submitted, store the current round id
   * in the list of rounds that have been submitted.
   *
   * @return void.
   */
  Ov.vent.on('blank:submit', function() {
    Round.RoundCollection.recordSubmission();
  });

  /*
   * When a vote is committed, update the round record.
   *
   * @param {Number} value: The new value.
   *
   * @return void.
   */
  Ov.vent.on('points:newValue', function(value) {

    // Retrieve the round record.
    var round = Round.RoundCollection.get(
      Round.RoundCollection.getCurrentRound()
    );

    // Set new point value, save.
    round.set('points', value);
    round.save();

  });

  return Round;

})(Backbone, Ov);
