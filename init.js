/*
 * Startup.
 */

// Boot hook.
module.exports = function(app) {

  // Declare the global trackers.
  global.Oversoul = {
    timers: {},
    votes: {}
  };

};
