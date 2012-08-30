/*
 * Connect to database.
 */

module.exports = function(config) {

  // Connect to Mongo.
  exports = mongoose = require('mongoose');
  exports = db = mongoose.connect(config.db.uri);
  exports = Schema = mongoose.Schema;

  // In-memory stores.
  global.Oversoul = { timers: {}, votes: {} };

};
