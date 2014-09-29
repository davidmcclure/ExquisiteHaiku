
/**
 * Load all controllers.
 */

var requireDir = require('require-directory');


module.exports = function(app, io) {
  requireDir(module, {
    visit: function(controller) {
      controller(app, io);
    }
  });
};
