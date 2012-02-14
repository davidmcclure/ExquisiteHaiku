/*
 * College model.
 */

// Module dependencies.
var states = require('../../lib/states').states;

// Schema definition.
var College = new Schema({
  name :                { type: String, required: true, unique: true },
  slug :                { type: String, required: true, unique: true },
  url :                 String,
  city :                String,
  state :               { type: String, enum: states },
  numUndergrads :       Number,
  numGrads :            Number,
  admitRate :           Number,
  rank :                Number,
  satCR25 :             Number,
  satCR75 :             Number,
  satM25 :              Number,
  satM75 :              Number,
  satW25 :              Number,
  satW75 :              Number,
  act25 :               Number,
  act75 :               Number
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
College.virtual('id').get(function() {
  return this._id.toHexString();
});

/*
 * Check plaintext string against encrypted password.
 *
 * @param {String} plainText: The plaintext submission.
 *
 * @return {Boolean}: True the plaintext is the password.
 */
College.methods.addPublication = function(publication) {
  this.publications.push(publication);
};

mongoose.model('College', College);
