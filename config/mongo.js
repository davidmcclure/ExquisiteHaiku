
/**
 * Connect to database.
 */

var mongoose = require('mongoose');

// Connect to MongoLab, if available.
var uri = process.env.MONGOLAB_URI || global.config.db;
mongoose.connect(uri);

// In-memory stores.
global.Oversoul = { timers: {}, votes: {} };
