/*
 * Scoring routine.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
var Poem = mongoose.model('Poem');

exports.integrator = function(id, scb) {
  Poem.send(id, Date.now(), scb, function() {});
};
