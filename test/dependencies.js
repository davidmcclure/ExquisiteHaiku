
/**
 * Testing dependencies.
 */

// Modules
// -------
exports.mocha =       require('mocha');
exports.should =      require('should');
exports.assert =      require('assert');
exports.browser =     require('zombie');
exports.async =       require('async');
exports.sinon =       require('sinon');
exports.mongoose =    require('mongoose');
exports.io =          require('socket.io-client');
exports.helpers =     require('./helpers');
exports.fs =          require('fs');
exports.jade =        require('jade');
exports._ =           require('lodash');


// Models
// ------

require('../app/models');
exports.User = exports.mongoose.model('User');
exports.Poem = exports.mongoose.model('Poem');
exports.Round = exports.mongoose.model('Round');
exports.Vote = exports.mongoose.model('Vote');


// Config
// ------

// Load configuration.
var config = require('yaml-config');
exports.root = config.readConfig(process.cwd()+'/test/config.yaml').root;


// Run
// ---

process.env.NODE_ENV = 'testing';
exports.server = require('../app');
