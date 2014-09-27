
/**
 * Round collection.
 */

Ov.Collections.Round = Backbone.Collection.extend({

  localStorage: new Backbone.LocalStorage('Oversoul'),

  /**
   * Initialize round tracker.
   */
  initialize: function() {
    this.current = null;
  },

  /**
   * Get the current round.
   *
   * @return {Object}: The round.
   */
  getCurrentRound: function() {

    // Get current id.
    var id = this.current ? this.current :
      _.last(P.rounds)._id;

    // Get the round.
    return this.get(id);

  },

  /**
   * Register a round record.
   *
   * @param {String} id: The round id.
   * @return {Object}: The new round.
   */
  registerNewRound: function(id) {

    // Store id.
    this.current = id;

    // Create round.
    return this.create({
      id: id, points: P.seedCapital
    });

  }

});
