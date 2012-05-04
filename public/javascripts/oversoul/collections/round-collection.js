/*
 * Round collection.
 */

Ov.Collections.Round = Backbone.Collection.extend({

  model: Ov.Models.Round,

  localStorage: new Store('oversoul:rounds')

});
