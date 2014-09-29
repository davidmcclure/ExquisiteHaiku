
/**
 * Database connector for model unit tests.
 */

// Module dependencies.
var configFile = require('yaml-config');

// Load testing configuration.
global.config = config.readConfig(process.cwd()+'/config.yaml');

// Connect.
exports = mongoose = require('mongoose');
mongoose.connect(global.config.db);
exports = Schema = mongoose.Schema;

// In-memory stores.
global.Oversoul = { timers: {}, votes: {} };
