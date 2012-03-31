/*
 * Word model.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
var vote = require('./vote');

// Schema definition.
var WordSchema = new Schema({
  round :     { type: Schema.ObjectId, ref: 'Round', required: true },
  word :      { type: String, required: true },
  votes :     [ vote.VoteSchema ]
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
WordSchema.virtual('id').get(function() {
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
WordSchema.methods.score = function(now, decay, cb) {

  var rank = 0; var churn = 0;

  _.each(this.votes, function(vote) {

    // Score vote, increment trackers.
    var score = vote.score(now, decay);
    rank += score[0]; churn += score[1];

  });

  cb([rank, churn]);

};


// Register model.
mongoose.model('Word', WordSchema);
var Word = mongoose.model('Word');
