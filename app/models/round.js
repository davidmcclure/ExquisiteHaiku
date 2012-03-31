/*
 * Round model.
 */

// Module dependencies.
var _ = require('underscore');

// Word model.
require('./word');
var Word = mongoose.model('Word');

// Schema definition.
var RoundSchema = new Schema({
  poem :      { type: Schema.ObjectId, ref: 'Poem', required: true },
  started :   { type: Date, default: Date.now(), required: true }
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
RoundSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

/*
 * Score the round.
 *
 * @param {Date} now: The current Date.
 * @param {Number} decay: The mean decay lifetime.
 * @param {Number} len: The stack size.
 * @param {Function}: The callback;
 *
 * @return {Array}: [[rank], [churn]].
 */
RoundSchema.methods.score = function(now, decay, len, cb) {

  var rank = []; var churn = [];

  Word.find({ round: this.id }, function(err, words) {

    _.each(words, function(word) {

      // Score word.
      var score = word.score(now, decay);

      // Push scores onto stacks.
      rank.push([word.word, score[0]]);
      churn.push([word.word, score[1]]);

    });

    // Sort comparer.
    var comp = function(a,b) { return b[1]-a[1]; };

    // Sort and slice.
    rank = rank.sort(comp).slice(0, len);
    churn = churn.sort(comp).slice(0, len);

    cb([rank, churn]);

  });

};


// Register model.
mongoose.model('Round', RoundSchema);
var Round = mongoose.model('Round');
