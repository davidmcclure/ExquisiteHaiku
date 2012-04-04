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
RoundSchema.methods.score = function(now, decay, len, cb) {

  var r = {}; var c = {};

  // Get votes.
  Vote.find({round: this.id }, function(err, votes) {

    _.each(votes, function(vote) {

      // Score vote.
      var score = vote.score(now, decay);

      // Push to tracker objects.
      if (!_.has(r, vote.word)) {
        r[vote.word] = score.rank;
        c[vote.word] = score.churn;
      } else {
        r[vote.word] += score.rank;
        c[vote.word] += score.churn;
      }

    });

    // Cast rank to array.
    var rank = [];
    _.each(r, function(val, key) {
      rank.push([key, val]);
    });

    // Cast churn to array.
    var churn = [];
    _.each(c, function(val, key) {
      churn.push([key, val]);
    });

    // Sort comparer.
    var comp = function(a,b) { return b[1]-a[1]; };

    // Sort and slice.
    rank = rank.sort(comp).slice(0, len);
    churn = churn.sort(comp).slice(0, len);

    cb({ rank: rank, churn: churn });

  });

};


// Register model.
mongoose.model('Round', RoundSchema);
var Round = mongoose.model('Round');

// Expose the schema.
module.exports = {
  RoundSchema: RoundSchema
};
