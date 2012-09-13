/*
 * Testing dependencies.
 */

// Modules
// -------
exports.mocha = require('mocha');
exports.should = require('should');
exports.assert = require('assert');
exports.Browser = require('zombie');
exports.async = require('async');
exports.sinon = require('sinon');
exports.config = require('yaml-config');
exports.mongoose = require('mongoose');
exports.ioClient = require('socket.io-client');
exports.init = require('../init');
exports.helpers = require('./helpers');
exports.fs = require('fs');
exports.jade = require('jade');
exports._ = require('underscore');


// Models
// ------

// User.
var user = require('../app/models/user');
exports.User = exports.mongoose.model('User');

// Poem.
var poem = require('../app/models/poem');
exports.Poem = exports.mongoose.model('Poem');

// Round.
var round = require('../app/models/round');
exports.Round = exports.mongoose.model('Round');

// Vote.
var vote = require('../app/models/vote');
exports.Vote = exports.mongoose.model('Vote');


// Helpers
// -------

// Login form.
exports.loginForm = require('../helpers/forms/login');

// Poem form.
exports.poemForm = require('../helpers/forms/poem');

// Register form.
exports.registerForm = require('../helpers/forms/register');

// Middleware.
exports.auth = require('../helpers/middleware');

// Validators.
exports.validators = require('../helpers/validators');


// Config
// ------

// Load configuration.
exports.root = exports.config.readConfig('test/config.yaml').root;


// Run
// ---

process.env.NODE_ENV = 'testing';
exports.server = require('../app');
