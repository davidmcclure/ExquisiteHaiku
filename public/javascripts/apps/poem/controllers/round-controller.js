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
  Round.init = function() {
    Round.Rounds = new Ov.Collections.Round();
    Round.Rounds.fetch();
  };


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
    var round = Round.Rounds.get(data.round);

    // If first slice.
    if (_.isNull(Ov.global.isVoting)) {

      // Submitting.
      if (_.isEmpty(round)) {
        Ov.global.isVoting = false;
        Ov.vent.trigger('state:submit');
      }

      // Voting.
      else {
        Ov.global.isVoting = true;
        Ov.vent.trigger('state:vote', round);
      }

    }

    else {

      // Vote -> submit.
      if (_.isEmpty(round) && Ov.global.isVoting) {
        Ov.global.isVoting = false;
        Ov.global.isDragging = false;
        Ov.vent.trigger('state:submit');
      }

      // Submit -> vote.
      else if (!_.isEmpty(round) && !Ov.global.isVoting) {
        Ov.global.isVoting = true;
        Ov.vent.trigger('state:vote', round);
      }

    }

    // Store the current round.
    Round.Rounds.currentRound = data.round;

  });

  /*
   * When words are submitted, store the current round id
   * in the list of rounds that have been submitted.
   *
   * @return void.
   */
  Ov.vent.on('blank:submit', function() {
    Round.Rounds.recordSubmission();
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
    var round = Round.Rounds.get(
      Round.Rounds.getCurrentRound()
    );

    // Set new point value, save.
    round.set('points', value);
    round.save();

  });


  // Export.
  Ov.addInitializer(function() { Round.init(); });
  return Round;

})(Backbone, Ov);
