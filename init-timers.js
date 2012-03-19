/*
 * Timers startup.
 */

// Module dependencies.
var async = require('async');

// Models.
var Poem = mongoose.model('Poem');

// Declare the global timer tracker object.
global.Oversoul = { timers: {} };

// Boot running timers.
Poem.find({ running: true }, function(err, poems) {

  // Start worker.
  var start = function(document, callback) {
    document.start(function(err) {
      callback(null, document);
    });
  };

  // Start.
  async.map(poems, start, function(err, documents) {});
  console.log('Starting %d poems', poems.length);

});
