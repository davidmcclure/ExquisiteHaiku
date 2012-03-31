/*
 * Scoring routine.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
var Poem = mongoose.model('Poem');
var Round = mongoose.model('Round');
var Word = mongoose.model('Word');
var Vote = mongoose.model('Vote');

exports.integrator = function(poem, cb) {
  cb();
};
