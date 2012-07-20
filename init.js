/*
 * Startup.
 */

module.exports = function(app, config) {

  // Shell in-memory trackers.
  global.Oversoul = { timers: {}, votes: {} };

  // Set application constants.
  app.set('sliceInterval', config.sliceInterval);
  app.set('visibleWords', config.visibleWords);

};
