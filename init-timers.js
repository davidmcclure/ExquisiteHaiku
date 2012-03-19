/*
 * Timers startup.
 */

// Models.
var Poem = mongoose.model('Poem');

// Declare the global timer tracker object.
global.Oversoul = { timers: {} };

// Reset all poems to idle.
Poem.reset(function(err, num) {});
