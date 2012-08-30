/*
 * Database connector for model unit tests.
 */

// Module dependencies.
var configFile = require('yaml-config'),

// Load configuration.
config = configFile.readConfig('config.yaml');

// Connect.
exports = mongoose = require('mongoose');
mongoose.connect(config.db.uri);
exports = Schema = mongoose.Schema;

// In-memory stores.
global.Oversoul = { timers: {}, votes: {} };
