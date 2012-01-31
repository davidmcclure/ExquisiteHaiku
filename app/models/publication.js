/*
 * Publication model.
 */

// Schema definition.
var Publication = new Schema({
    name :              String,
    url :               String,
});

// Id getter.
Publication.virtual('id').get(function() {
    return this._id.toHexString();
});

mongoose.model('Publication', Publication)
