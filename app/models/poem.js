/*
 * Poem model.
 */

// Module dependencies.
var _ = require('underscore');
var syllables = require('../../lib/syllables');

// Round model.
var round = require('./round');
var Round = mongoose.model('Round');

// Vote model.
var vote = require('./vote');
var Vote = mongoose.model('Vote');

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

  var expiration = null;

  // If there is a round, get expiration.
  if (!_.isUndefined(this.round)) {
    var started = this.round.started.valueOf();
    expiration = started + this.roundLength;
  }

  return expiration;

});


/*
 * Get total syllables.
 *
 * @return {Number}: The syllable count.
 */
PoemSchema.virtual('syllableCount').get(function() {

  var count = 0;

  // Walk words.
  _.each(this.words, function(line) {
    _.each(line, function(word) {
      count += syllables[word];
    });
  });

  return count;

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
 *
 * @return {Boolean}: True if a new timer is set, false if
 * one already exists.
 */
PoemSchema.methods.start = function(slicer, scb) {

  // Block if timer already exists.
  if (_.has(global.Oversoul.timers, this.id)) {
    return false;
  }

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

  return true;

};


/*
 * Stop slicer.
 *
 * @return void.
 */
PoemSchema.methods.stop = function() {

  // Clear the timer, delete the tracker.
  clearInterval(global.Oversoul.timers[this.id]);
  delete global.Oversoul.timers[this.id];

  // Set tracker.
  this.running = false;

};

/*
 * Create a new round.
 *
 * @return void.
 */
PoemSchema.methods.newRound = function() {

  // Create and push new round.
  var round = new Round({ started: Date.now() });
  this.rounds.push(round);

  // Create votes array on global.
  global.Oversoul.votes[round.id] = {};

  return round;

};


/*
 * Get time remaining in current round.
 *
 * @param {Date} now: The current time.
 *
 * @return {Number}: The remaining time in ms.
 */
PoemSchema.methods.timeLeftInRound = function(now) {

  var remaining = null;

  // If there is a round, get remaining time.
  if (!_.isUndefined(this.round)) {
    remaining = this.roundExpiration - now;
  }

  return remaining;

};


/*
 * Add a word to the poem array.
 *
 * @param {Function} cb: Callback.
 *
 * @return {Boolean}: True if the word fits in the syllable
 * pattern of the poem, False if not.
 */
PoemSchema.methods.addWord = function(word) {

  // Lowercase word.
  word = word.toLowerCase();

  // Word syllable count.
  var syll = syllables[word];

  // Non-word.
  if (!_.has(syllables, word)) {
    return false;
  }

  // No words.
  else if (_.isEmpty(this.words)) {
    this.words.push([word]);
    return true;
  }

  // 1 line.
  else if (this.words.length == 1) {

    // Sum syllables.
    var count = 0;
    _.each(this.words[0], function(w) {
      count += syllables[w];
    });

    // If space, push.
    if (count + syll <= 5) {
      this.words[0].push(word);
      return true;
    }

    // If line 1 full, create line 2.
    else if (count == 5) {
      this.words.push([word]);
      return true;
    }

  }

  // 2 lines.
  else if (this.words.length == 2) {

    // Sum syllables.
    var count = 0;
    _.each(this.words[1], function(w) {
      count += syllables[w];
    });

    // If space, push.
    if (count + syll <= 7) {
      this.words[1].push(word);
      return true;
    }

    // If line 2 full, create line 3.
    else if (count == 7) {
      this.words.push([word]);
      return true
    }

  }

  // 3 lines.
  else if (this.words.length == 3) {

    // Sum syllables.
    var count = 0;
    _.each(this.words[2], function(w) {
      count += syllables[w];
    });

    // If space, push.
    if (count + syll <= 5) {
      this.words[2].push(word);
      return true;
    }

  }

  return false;

};


/*
 * Commit a point allocation on a word.
 *
 * @param {String} word: The word.
 * @param {Number} quantity: The point quantity.
 *
 * @return void.
 */
PoemSchema.methods.vote = function(word, quantity) {

  var vote = [quantity, Date.now()];

  // If a tracker for the word exists.
  if (_.has(global.Oversoul.votes[this.round.id], word)) {
    global.Oversoul.votes[this.round.id][word].push(vote);
  }

  // Set votes tracker.
  else {
    global.Oversoul.votes[this.round.id][word] = [vote];
  }

};


/*
 * -------------------
 * Collection methods.
 * -------------------
 */


/*
 * Find poem by id, score, return stacks.
 *
 * @param {Number} id: The poem id.
 * @param {Date} now: The current timestamp.
 * @param {Function} send: Broadcaster callback.
 * @param {Function} cb: Post-save callback.
 *
 * @return void.
 */
PoemSchema.statics.score = function(id, now, send, cb) {

  // Get poem.
  this.findById(id, function(err, poem) {

    var rId = poem.round.id;
    var stack = [];

    // Get decay lifetime inverse.
    var decayL = poem.decayLifetime;
    var decayI = 1/decayL;

    // Walk words.
    _.each(global.Oversoul.votes[rId], function(votes, word) {

      stack.unshift([word, 0, 0]);

      // Score votes.
      _.each(votes, function(vote) {

        // Compute churn.
        var decay = Math.exp(-(now-vote[1]) * decayI);
        stack[0][2] += Math.round(vote[0] * decay);

        // Compute rank.
        var b1 = vote[0] * -decayL;
        var b2 = b1 * decay;
        stack[0][1] += Math.round(((b2-b1)*0.001));

      });

    });

    // Sort stack by rank.
    stack = stack.sort(function(a,b) {
      return b[1]-a[1];
    });

    // Truncate to visible words.
    stack = stack.slice(0, poem.visibleWords);

    // Add rank ratios.
    _.each(stack, function(s) {
      s.push((s[1]/stack[0][1]).toFixed(2));
    });

    // Check for round expiration.
    if (now > poem.roundExpiration) {

      // Push new word.
      if (!_.isEmpty(stack)) {
        poem.addWord(stack[0][0]);
        poem.markModified('words');
      }

      // If poem is complete, stop.
      if (poem.syllableCount == 17) {
        poem.stop();
      }

      // Otherwise, create new round.
      else {
        poem.newRound();
        stack = [];
      }

    }

    // Emit stacks.
    send({
      stack: stack,
      syllables: poem.syllableCount,
      round: poem.round.id,
      poem: poem.words,
      clock: poem.timeLeftInRound(now)
    });

    // Save poem.
    poem.save(function(err) {
      cb();
    });

  });

};


// Register model.
mongoose.model('Poem', PoemSchema);
var Poem = mongoose.model('Poem');
