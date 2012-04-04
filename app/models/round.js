/*
 * Round model.
 */

// Module dependencies.
var _ = require('underscore');

// Models.
require('./vote');
var Vote = mongoose.model('Vote');

// Schema definition.
var RoundSchema = new Schema({
  started :   { type: Date, default: Date.now(), required: true }
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
RoundSchema.virtual('id').get(function() {
  return this._id.toHexString();
});


/*
 * -----------------
 * Document methods.
 * -----------------
 */


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
RoundSchema.methods.score = function(now, decay, len) {

  var rank = []; var churn = [];

  // Get votes.
  Vote.find({round: this.id }, function(err, votes) {
    console.log(votes);
  });




  // _.each(this.words, function(word) {

  //   // Score word.
  //   var score = word.score(now, decay);

  //   // Push scores onto stacks.
  //   rank.push([word.word, score[0]]);
  //   churn.push([word.word, score[1]]);

  // });

  // // Sort comparer.
  // var comp = function(a,b) { return b[1]-a[1]; };

  // // Sort and slice.
  // rank = rank.sort(comp).slice(0, len);
  // churn = churn.sort(comp).slice(0, len);

  // return { rank: rank, churn: churn };

};


// Register model.
mongoose.model('Round', RoundSchema);
var Round = mongoose.model('Round');

// Expose the schema.
module.exports = {
  RoundSchema: RoundSchema
};
