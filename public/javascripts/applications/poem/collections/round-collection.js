/*
 * Round collection.
 */

Ov.Collections.Round = Backbone.Collection.extend({

  localStorage: new Backbone.LocalStorage('Oversoul'),

  /*
   * Initialize round tracker.
   *
   * @return void.
   */
  initialize: function() {
    this.currentRound = null;
  },

  /*
   * Get the current round id.
   *
   * @return {Number}: The round id.
   */
  getCurrentRound: function() {

    // If defined, return currentRound.
    if (!_.isNull(this.currentRound)) {
      return this.currentRound;
    }

    // Else, use the templated Poem object.
    else {
      return _.last(P.rounds)._id;
    }

  },

  /*
   * Store the current round as submitted.
   *
   * @return void.
   */
  recordSubmission: function() {
    this.create({
      id: this.getCurrentRound(),
      points: P.seedCapital
    });
  }

});
