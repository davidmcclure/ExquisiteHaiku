/*
 * Round model.
 */

// Module dependencies.
var slicer = require('../../lib/slicer'),
  _ = require('underscore');

// Schema definition.
var Round = new Schema({
  poem :            { type: Schema.ObjectId, ref: 'Poem', required: true },
  started :         { type: Date, default: Date.now(), required: true }
});


/*
 * -----------------
 * Document methods.
 * -----------------
 */


/*
 * Get id.
 *
 * @return {String}: The id.
 */
Round.virtual('id').get(function() {
  return this._id.toHexString();
});


// Register model.
mongoose.model('Round', Round);
var Round = mongoose.model('Round');
