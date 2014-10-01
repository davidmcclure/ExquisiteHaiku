
/**
 * Connect to database.
 */

// Connect to Mongo.
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI);

// In-memory stores.
global.Oversoul = { timers: {}, votes: {} };
