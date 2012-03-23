/*
 * Word model.
 */

// Module dependencies.
var _ = require('underscore');

// Schema definition.
var Word = new Schema({
  round :     { type: Schema.ObjectId, ref: 'Round', required: true },
  word :      { type: String, required: true }
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
Word.virtual('id').get(function() {
  return this._id.toHexString();
});


// Register model.
mongoose.model('Word', Word);
var Word = mongoose.model('Word');
