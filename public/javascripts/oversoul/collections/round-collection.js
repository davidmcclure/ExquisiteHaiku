/*
 * Round collection.
 */

Ov.Collections.Round = Backbone.QueryCollection.extend({

  // Tracker for current round.
  currentRound: null,

  // Storage for list of submitted rounds.
  localStorage: new Store('oversoul:rounds')

});
