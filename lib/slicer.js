/*
 * Scoring routine.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
var Poem = mongoose.model('Poem');

exports.integrator = function(id, scb) {
  Poem.score(id, scb, function() {});
};
