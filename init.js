/*
 * Startup.
 */

module.exports = function(app) {

  // In-memory stores.
  global.Oversoul = { timers: {}, votes: {} };

  // Set application constants.
  app.set('sliceInterval', config.sliceInterval);
  app.set('visibleWords', config.visibleWords);

};
