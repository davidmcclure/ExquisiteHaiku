/*
 * Poem model.
 */

// Module dependencies.
var slicer = require('../../lib/slicer');

// Schema definition.
var Poem = new Schema({
  slug :            { type: String, required: true },
  user :            { type: Schema.ObjectId, ref: 'User', required: true },
  admin :           { type: Boolean, required: true },
  created :         { type: Date, required: true, default: Date.now() },
  roundLength :     { type: Number, required: true },
  sliceInterval :   { type: Number, required: true },
  minSubmissions :  { type: Number, required: true },
  submissionVal :   { type: Number, required: true },
  decayLifetime :   { type: Number, required: true },
  seedCapital :     { type: Number, required: true }
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
Poem.virtual('id').get(function() {
  return this._id.toHexString();
});

/*
 * Start slicer.
 *
 * @return void.
 */
Poem.methods.start = function() {
  Oversoul.timers[this.id] = setInterval(
    slicer.integrator,
    this.sliceInterval,
    this
  );
};

/*
 * Stop slicer.
 *
 * @return void.
 */
Poem.methods.stop = function() {
  clearInterval(Oversoul.timers[this.id]);
};


// Register model.
mongoose.model('Poem', Poem);
var Poem = mongoose.model('Poem');
