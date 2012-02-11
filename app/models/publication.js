/*
 * Publication model.
 */

// Models.
var College = mongoose.model('College');

// Schema definition.
var Publication = new Schema({
    name :              { type: String, required: true, unique: true },
    slug :              { type: String, required: true, unique: true },
    url :               { type: String, required: true, unique: true },
    college_id :        { type: Schema.ObjectId, ref: 'College' }
});

// Id getter.
Publication.virtual('id').get(function() {
    return this._id.toHexString();
});

mongoose.model('Publication', Publication);
