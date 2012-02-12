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
 * @return string: The id.
 */
College.virtual('id').get(function() {
    return this._id.toHexString();
});

mongoose.model('College', College);
