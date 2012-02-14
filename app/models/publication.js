/*
 * Publication model.
 */

// Schema definition.
var Publication = new Schema({
  name :    { type: String, required: true, unique: true },
  slug :    { type: String, required: true, unique: true },
  url :     { type: String, required: true, unique: true },
  college : { type: Schema.ObjectId, ref: 'College', required: true }
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
Publication.virtual('id').get(function() {
  return this._id.toHexString();
});

mongoose.model('Publication', Publication);
