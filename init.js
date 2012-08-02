/*
 * Startup.
 */

module.exports = function(app) {

  // Shell in-memory trackers.
  global.Oversoul = { timers: {}, votes: {} };

  // Set application constants.
  app.set('sliceInterval', config.sliceInterval);
  app.set('visibleWords', config.visibleWords);

};
