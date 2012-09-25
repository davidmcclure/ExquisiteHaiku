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
  isDragging: false,
  isFrozen: false
};
