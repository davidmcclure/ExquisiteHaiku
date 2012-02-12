/*
 * College model.
 */

// Schema definition.
var College = new Schema({
    name :              { type: String, required: true, unique: true },
    slug :              { type: String, required: true, unique: true },
    url :               String,
    city :              String,
    state :             String,
    numUndergrads :     Number,
    numGrads :          Number,
    admitRate :         Number,
    rank :              Number,
    satCR25 :           Number,
    satCR75 :           Number,
    satM25 :            Number,
    satM75 :            Number,
    satW25 :            Number,
    satW75 :            Number,
    act25 :             Number,
    act75 :             Number
});

// Id getter.
College.virtual('id').get(function() {
    return this._id.toHexString();
});

mongoose.model('College', College);