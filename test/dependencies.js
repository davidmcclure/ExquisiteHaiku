
/**
 * Testing dependencies.
 */

// Modules
// -------
exports.should =      require('should');
exports.browser =     require('zombie');
exports.async =       require('async');
exports.sinon =       require('sinon');
exports.mongoose =    require('mongoose');
exports.io =          require('socket.io-client');
exports.helpers =     require('./helpers');
exports.fs =          require('fs');
exports.jade =        require('jade');
exports._ =           require('lodash');

require('../app/models');

// Load configuration.
var config = require('yaml-config');
exports.root = config.readConfig(process.cwd()+'/test/config.yaml').root;

// Start the server.
process.env.NODE_ENV = 'testing';
exports.server = require('../app');
