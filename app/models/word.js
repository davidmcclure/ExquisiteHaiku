/*
 * Word model.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
var vote = require('./vote');

// Schema definition.
var WordSchema = new Schema({
  word :      { type: String, required: true },
  votes :     [ vote.VoteSchema ]
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
WordSchema.virtual('id').get(function() {
  return this._id.toHexString();
});


/*
 * -----------------
 * Document methods.
 * -----------------
 */


/*
 * Score the word.
 *
 * @param {Date} now: The current Date.
 * @param {Number} decay: The mean decay lifetime.
 *
 * @return {Array}: [rank, churn].
 */
WordSchema.methods.score = function(now, decay) {

  var rank = 0; var churn = 0;

  _.each(this.votes, function(vote) {

    // Score vote, increment trackers.
    var score = vote.score(now, decay);
    rank += score[0]; churn += score[1];

  });

  return [rank, churn];

};


// Register model.
mongoose.model('Word', WordSchema);
var Word = mongoose.model('Word');

// Expose the schema.
module.exports = {
  WordSchema: WordSchema
};
