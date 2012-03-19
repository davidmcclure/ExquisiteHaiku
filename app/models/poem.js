/*
 * Poem model.
 */

// Module dependencies.
var slicer = require('../../lib/slicer'),
  _ = require('underscore');

// Schema definition.
var Poem = new Schema({
  slug :            { type: String, required: true },
  user :            { type: Schema.ObjectId, ref: 'User', required: true },
  created :         { type: Date, required: true, default: Date.now() },
  running :         { type: Boolean, required: true, default: false },
  complete :        { type: Boolean, required: true, default: false },
  roundLength :     { type: Number, required: true },
  sliceInterval :   { type: Number, required: true },
  minSubmissions :  { type: Number, required: true },
  submissionVal :   { type: Number, required: true },
  decayLifetime :   { type: Number, required: true },
  seedCapital :     { type: Number, required: true },
  visibleWords :    { type: Number, required: true }
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
 * Start timer.
 *
 * @param {Function} cb: Callback.
 *
 * @return void.
 */
Poem.methods.start = function(cb) {

  // Block if timer already exists.
  if (_.has(global.Oversoul.timers, this.id)) {
    cb(Error('Timer for ' + this.id + ' is already running'));
  }

  else {

    // Create and store timer.
    global.Oversoul.timers[this.id] = setInterval(
      slicer.integrator,
      this.sliceInterval,
      this
    );

    // Set tracker.
    this.running = true;
    cb();

  }

};

/*
 * Stop slicer.
 *
 * @param {Function} cb: Callback.
 *
 * @return void.
 */
Poem.methods.stop = function(cb) {

  // Clear the timer, delete the tracker.
  clearInterval(global.Oversoul.timers[this.id]);
  delete global.Oversoul.timers[this.id];

  // Set tracker.
  this.running = false;
  cb();

};


/*
 * -------------------
 * Collection methods.
 * -------------------
 */


/*
 * Set all poems running = false.
 *
 * @param {Function} cb: Callback.
 *
 * @return void.
 */
Poem.statics.reset = function(cb) {
  this.update({}, { running: false }, {}, cb);
};


// Register model.
mongoose.model('Poem', Poem);
var Poem = mongoose.model('Poem');
