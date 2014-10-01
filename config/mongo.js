
/**
 * Connect to database.
 */

var mongoose = require('mongoose');

// Connect to Mongo.
mongoose.connect(global.config.db);

// Initialize in-memory stores.
global.Oversoul = { timers: {}, votes: {} };
