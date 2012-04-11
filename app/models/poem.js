/*
 * Poem model.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
var round = require('./round');
var Round = mongoose.model('Round');

// Schema definition.
var PoemSchema = new Schema({
  slug : {
    type: String,
    required: true
  },
  user : {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  created : {
    type: Date,
    required: true,
    default: Date.now()
  },
  started : {
    type: Boolean,
    required: true,
    default: false
  },
  running : {
    type: Boolean,
    required: true,
    default: false
  },
  complete : {
    type: Boolean,
    required: true,
    default: false
  },
  roundLength : {
    type: Number,
    required: true
  },
  sliceInterval : {
    type: Number,
    required: true
  },
  minSubmissions : {
    type: Number,
    required: true
  },
  submissionVal : {
    type: Number,
    required: true
  },
  decayLifetime : {
    type: Number,
    required: true
  },
  seedCapital : {
    type: Number,
    required: true
  },
  visibleWords : {
    type: Number,
    required: true
  },
  words: {
    type: Array
  },
  rounds : [
    round.RoundSchema
  ]
});


/*
 * -----------
 * Validators.
 * -----------
 */


/*
 * If the poem has not been started, then running and complete
 * must be false.
 *
 * @return {Boolean}: True if the statuses are valid.
 */
PoemSchema.path('started').validate(function(v) {
  return v || (!this.running && !this.complete);
});

/*
 * If the poem is running, started must be true and complete
 * must be false.
 *
 * @return {Boolean}: True if the statuses are valid.
 */
PoemSchema.path('running').validate(function(v) {
  return !v || (this.started && !this.complete);
});

/*
 * If the poem is complete, started must be true and running
 * must be false.
 *
 * @return {Boolean}: True if the statuses are valid.
 */
PoemSchema.path('complete').validate(function(v) {
  return !v || (this.started && !this.running);
});


/*
 * -------------------
 * Virtual attributes.
 * -------------------
 */


/*
 * Get id.
 *
 * @return {String}: The id.
 */
PoemSchema.virtual('id').get(function() {
  return this._id.toHexString();
});


/*
 * Get unstarted status.
 *
 * @return {Boolean}: True if unstarted.
 */
PoemSchema.virtual('unstarted').get(function() {
  return !this.started;
});


/*
 * Get paused status.
 *
 * @return {Boolean}: True if paused.
 */
PoemSchema.virtual('paused').get(function() {
  return this.started && !this.running && !this.complete;
});


/*
 * Get status.
 *
 * @return {String}: The status.
 */
PoemSchema.virtual('status').get(function() {

  if (this.unstarted) {
    return 'unstarted';
  }

  else if (this.running) {
    return 'running';
  }

  else if (this.paused) {
    return 'paused';
  }

  else if (this.complete) {
    return 'complete';
  }

});


/*
 * Get current round.
 *
 * @return {Object}: The current round.
 */
PoemSchema.virtual('round').get(function() {
  return _.last(this.rounds);
});


/*
 * Get round expiration.
 *
 * @return {Date}: The expiration stamp.
 */
PoemSchema.virtual('roundExpiration').get(function() {

  if (!_.isUndefined(this.round)) {
    return this.round.started.valueOf() + this.roundLength;
  }

  else return undefined;

});


/*
 * -----------------
 * Document methods.
 * -----------------
 */


/*
 * Start timer.
 *
 * @param {Function} slicer: The slicer.
 * @param {Function} scb: Slicer callback.
 * @param {Function} cb: Callback.
 *
 * @return void.
 */
PoemSchema.methods.start = function(slicer, scb, cb) {

  // Block if timer already exists.
  if (_.has(global.Oversoul.timers, this.id)) {
    cb(Error('Timer for ' + this.id + ' is already running'));
  }

  else {

    // Create and store timer.
    global.Oversoul.timers[this.id] = setInterval(
      slicer,
      this.sliceInterval,
      this.id,
      scb
    );

    // Set trackers.
    this.running = true;
    this.started = true;
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
PoemSchema.methods.stop = function(cb) {

  // Clear the timer, delete the tracker.
  clearInterval(global.Oversoul.timers[this.id]);
  delete global.Oversoul.timers[this.id];

  // Set tracker.
  this.running = false;
  cb();

};

/*
 * Create a new round.
 *
 * @return void.
 */
PoemSchema.methods.newRound = function() {

  // Create new round.
  var round = new Round();
  this.rounds.push(round);

  // Create votes array on global.
  global.Oversoul.votes[round.id] = [];

  return round;

};

/*
 * Add a word to the poem array.
 *
 * @param {Function} cb: Callback.
 *
 * @return void.
 */
PoemSchema.methods.addWord = function(word) {
  this.words.push(word);
};


/*
 * -------------------
 * Collection methods.
 * -------------------
 */

/*
 * Find poem by id, score, return stacks and poem.
 *
 * @param {Number} id: The poem id.
 * @param {Function} broadcast: Data broadcast callback.
 * @param {Function} cb: Post-save callback.
 *
 * @return void.
 */
PoemSchema.statics.score = function(id, broadcast, cb) {

  // Get poem.
  this.findById(id, function(err, poem) {

    // Get round id.
    var rId = poem.round.id;

    // Make copies of word tracker.
    var r = global.Oversoul.words[rId];
    var c = r;

    // Get decay lifetime inverse and current time.
    var decayInverse = 1/poem.decayLifetime;
    var currentTime = Date.now();

    _.each(global.Oversoul.votes[rId], function(vote) {

      // Score the vote.
      var score = vote.score(
        currentTime,
        poem.decayLifetime,
        decayInverse
      );

      // Increment trackers.
      r[vote.word] += score.rank;
      c[vote.word] += score.churn;

    });

    // Cast rank to array.
    var rank = _.map(r, function(val, key) {
      return [key, val];
    });

    // Cast churn to array.
    var churn = _.map(c, function(val, key) {
      return [key, val];
    });

    // Sort comparer.
    var comp = function(a,b) { return b[1]-a[1]; };

    // Sort and slice.
    rank = rank.sort(comp).slice(0, poem.visibleWords);
    churn = churn.sort(comp).slice(0, poem.visibleWords);

    // Check for round expiration.
    if (Date.now() > poem.roundExpiration) {

      // Push new word, create new round.
      if (!_.isEmpty(rank)) poem.addWord(rank[0][0]);
      poem.newRound();

    }

    // Push data.
    broadcast({
      stacks: { rank: rank, churn: churn },
      poem: poem.words,
      round: poem.round.id
    });

    // Save.
    poem.save(function(err) {
      console.log(poem.rounds.length);
      cb();
    });

  });

};


// Register model.
mongoose.model('Poem', PoemSchema);
var Poem = mongoose.model('Poem');
