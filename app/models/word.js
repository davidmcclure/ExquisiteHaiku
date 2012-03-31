/*
 * Word model.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
require('./vote');
var Vote = mongoose.model('Vote');

// Schema definition.
var Word = new Schema({
  round :     { type: Schema.ObjectId, ref: 'Round', required: true },
  word :      { type: String, required: true }
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
Word.virtual('id').get(function() {
  return this._id.toHexString();
});

/*
 * Score the word.
 *
 * @param {Date}: The current Date.
 * @param {Number}: The mean decay lifetime.
 * @param {Function}: The callback;
 *
 * @return {Array}: [rank, churn].
 */
Word.methods.score = function(now, decay, cb) {

  var rank = 0; var churn = 0;

  // Get votes.
  Vote.find({ word: this.id }, function(err, votes) {

    _.each(votes, function(vote) {

      // Score vote, increment trackers.
      var score = vote.score(now, decay);
      rank += score[0]; churn += score[1];

    });

    cb([rank, churn]);

  });

};


// Register model.
mongoose.model('Word', Word);
var Word = mongoose.model('Word');
