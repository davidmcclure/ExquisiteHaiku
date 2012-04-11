/*
 * Timers startup.
 */

// Module dependencies.
var async = require('async');
var slicer = require('./lib/slicer');

// Models.
var Poem = mongoose.model('Poem');

// Boot hook.
exports.boot = function(app) {
  startTimers(app);
};

function startTimers(app) {

  // Declare the global trackers.
  global.Oversoul = {
    timers: {},
    votes: {},
    words: {}
  };

  // Boot running timers.
  Poem.find({ running: true }, function(err, poems) {

    // Slicer callback.
    var scb = function() {};

    // Start worker.
    var start = function(document, callback) {
      document.start(slicer.integrator, scb, function(err) {
        callback(null, document);
      });
    };

    // Start.
    async.map(poems, start, function(err, documents) {});
    if (app.settings.env !== 'testing') {
      console.log('Starting %d poems', poems.length);
    }

  });

}
