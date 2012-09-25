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
    this.currentRoundId = null;
  },

  /*
   * Get the current round id.
   *
   * @return {Number}: The round id.
   */
  getCurrentRoundId: function() {

    // If defined, return currentRound.
    if (!_.isNull(this.currentRoundId))
      return this.currentRoundId;

    // Else, use the Poem object.
    else return _.last(P.rounds)._id;

  },

  /*
   * Store the current round as submitted.
   *
   * @param {String} id: The round id.
   *
   * @return {Object}: The new round.
   */
  recordRound: function(id) {
    return this.create({ id: id, points: P.seedCapital });
  }

});
