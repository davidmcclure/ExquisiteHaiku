/*
 * Performance benchmarking routine for the slicer.
 *
 * To run: >> node slicer.benchmark.js {#words} {#votes / word}
 */

// Models.
require('../../../app/models/user');
require('../../../app/models/poem');
require('../../../app/models/round');
require('../../../app/models/word');
require('../../../app/models/vote');

// Slicer and words.
var slicer = require('../../../lib/slicer');
var words = require('../../../lib/syllables');
