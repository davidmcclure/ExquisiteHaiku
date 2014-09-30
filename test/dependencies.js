
/**
 * Testing dependencies.
 */

// Load configuration.
var config = require('yaml-config');
exports.root = config.readConfig(process.cwd()+'/test/config.yaml').root;

// Start the server.
process.env.NODE_ENV = 'testing';
exports.server = require('../app');
