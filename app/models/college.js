/*
 * College model.
 */

// Module dependencies.
var states = import('./_states');

// Load models.
require('./publication.js');
var Publication = mongoose.model('Publication');

// Schema definition.
var College = new Schema({
    name :              { type: String, unique: true },
    url :               String,
    city :              String,
    state :             { type: String, enum: states },
    public :            Boolean,
    numUndergrads :     Number,
    numGrads :          Number,
    tuition :           Number,
    admitRate :         Number,
    aidPercent :        Number,
    satCR25 :           Number,
    satCR75 :           Number,
    satM25 :            Number,
    satM75 :            Number,
    satW25 :            Number,
    satW75 :            Number,
    act25 :             Number,
    act75 :             Number,
    publications :      [Publication]
});

// Id getter.
College.virtual('id').get(function() {
    return this._id.toHexString();
});

mongoose.model('College', College)
