/*
 * Connect to database.
 */

// Connect to Mongo.
exports = mongoose = require('mongoose');
exports = db = mongoose.connect(global.config.db);
exports = Schema = mongoose.Schema;

// In-memory stores.
global.Oversoul = { timers: {}, votes: {} };
