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
    Round.started = false;
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

    // Create round.
    if (_.isEmpty(round)) {
      round = Round.Rounds.recordRound(data.round);
      Ov.vent.trigger('state:newRound', round);
      Ov.global.isDragging = false;
    }

    // If unstarted.
    else if (!Round.started) {
      Ov.vent.trigger('state:newRound', round);
      Round.started = true;
    }

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
    var round = Round.Rounds.getCurrentRound();

    // Set new point value, save.
    round.set('points', value);
    round.save();

  });


  // Export.
  Ov.addInitializer(function() { Round.init(); });
  return Round;

})(Backbone, Ov);
