/*
 * Application runner.
 */

Ov = new Backbone.Marionette.Application();

// --------------------
// Instance namespaces.
// --------------------
Ov.Controllers = {};
Ov.Collections = {};
Ov.Views = {};

// --------------------
// Application globals.
// --------------------
Ov.global = {
  points: 0,
  isDragging: false,
  isFrozen: false
};
