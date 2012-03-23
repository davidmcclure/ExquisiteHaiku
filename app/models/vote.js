/*
 * Vote model.
 */

// Module dependencies.
var _ = require('underscore');

// Schema definition.
var Vote = new Schema({
  word :      { type: Schema.ObjectId, ref: 'Word', required: true },
  quantity :  { type: Number, required: true },
  applied :   { type: Date, default: Date.now(), required: true }
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
Vote.virtual('id').get(function() {
  return this._id.toHexString();
});


// Register model.
mongoose.model('Vote', Vote);
var Vote = mongoose.model('Vote');
