/*
 * Startup.
 */

// Module dependencies.
var async = require('async');
var slicer = require('./lib/slicer');

// Models.
var Poem = mongoose.model('Poem');

// Boot hook.
exports.boot = function(app) {

  // Declare the global trackers.
  global.Oversoul = {
    timers: {},
    votes: {},
    words: {}
  };

};
