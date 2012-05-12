/*
 * Round collection.
 */

Ov.Collections.Round = Backbone.QueryCollection.extend({

  currentRound: null,
  localStorage: new Backbone.LocalStorage('Oversoul'),

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
      return _.last(Poem.rounds)._id;
    }

  },

  /*
   * Store the current round as submitted.
   *
   * @return void.
   */
  recordSubmission: function() {
    this.add({ round: this.getCurrentRound() });
  }

});
