/*
 * Testing dependencies.
 */

// Modules
// -------
mocha = require('mocha');
should = require('should');
assert = require('assert');
Browser = require('zombie');
async = require('async');
sinon = require('sinon');
config = require('yaml-config');
mongoose = require('mongoose');
ioClient = require('socket.io-client');
init = require('../init');
helpers = require('./helpers');
fs = require('fs');
jade = require('jade');
_ = require('underscore');


// Models
// ------

// User.
require('../app/models/user');
User = mongoose.model('User');

// Poem.
require('../app/models/poem');
Poem = mongoose.model('Poem');

// Round.
require('../app/models/round');
Round = mongoose.model('Round');

// Vote.
require('../app/models/vote');
Vote = mongoose.model('Vote');


// Helpers
// -------

// Login form.
loginForm = require('../helpers/forms/login');

// Poem form.
poemForm = require('../helpers/forms/poem');

// Register form.
registerForm = require('../helpers/forms/register');

// Middleware.
auth = require('../helpers/middleware');

// Validators.
validators = require('../helpers/validators');


// Config
// ------

// Load configuration.
root = config.readConfig('test/config.yaml').root;


// Run
// ---

process.env.NODE_ENV = 'testing';
server = require('../app');
