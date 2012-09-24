/*
 * Connect to database.
 */

// Connect to Mongo.
var mongoose = require('mongoose');
mongoose.connect(global.config.db);

// In-memory stores.
global.Oversoul = { timers: {}, votes: {} };
