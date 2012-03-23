/*
 * Poem model.
 */

// Module dependencies.
var _ = require('underscore');

// Schema definition.
var Poem = new Schema({
  slug :            { type: String, required: true },
  user :            { type: Schema.ObjectId, ref: 'User', required: true },
  round :           { type: Schema.ObjectId, ref: 'Round' },
  created :         { type: Date, required: true, default: Date.now() },
  running :         { type: Boolean, required: true, default: false },
  complete :        { type: Boolean, required: true, default: false },
  roundLength :     { type: Number, required: true },
  sliceInterval :   { type: Number, required: true },
  minSubmissions :  { type: Number, required: true },
  submissionVal :   { type: Number, required: true },
  decayLifetime :   { type: Number, required: true },
  seedCapital :     { type: Number, required: true },
  visibleWords :    { type: Number, required: true },
  words:            { type: Array }
});


/*
 * -----------
 * Validators.
 * -----------
 */


/*
 * If the poem is running, complete must be false.
 *
 * @return {Boolean}: True if the statuses are valid.
 */
Poem.path('running').validate(function(v) {
  return !v || !this.complete;
});

/*
 * If the poem is complete, running must be false.
 *
 * @return {Boolean}: True if the statuses are valid.
 */
Poem.path('complete').validate(function(v) {
  return !v || !this.running;
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
 * Add a word to the poem array.
 *
 * @param {Function} cb: Callback.
 *
 * @return void.
 */
Poem.methods.addWord = function(word) {
  this.words.push(word);
};


// Register model.
mongoose.model('Poem', Poem);
var Poem = mongoose.model('Poem');
