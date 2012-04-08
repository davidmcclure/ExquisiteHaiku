/*
 * Vote model.
 */

// Module dependencies.
var _ = require('underscore');

// Schema definition.
var VoteSchema = new Schema({
  word : {
    type: String,
    required: true
  },
  quantity : {
    type: Number,
    required: true
  },
  applied : {
    type: Date,
    default: Date.now(),
    required: true
  }
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
VoteSchema.virtual('id').get(function() {
  return this._id.toHexString();
});


/*
 * -----------------
 * Document methods.
 * -----------------
 */


/*
 * Score the vote.
 *
 * @param {Date} now: The current Date.
 * @param {Number} decayLifetime: The mean decay lifetime.
 *
 * @return {Array}: [rank, churn].
 */
VoteSchema.methods.score = function(now, decayLifetime) {

  // Get time delta.
  var delta = now - this.applied;

  // Compute unscaled decay coefficient.
  var decay = Math.exp(-delta / decayLifetime);

  // Compute churn.
  var churn = this.quantity * decay;

  // Starting boundaries.
  var bound1 = this.quantity * -decayLifetime;
  var bound2 = bound1 * decay;

  // Get the integral, scale and round.
  var rank = ((bound2-bound1)*0.001);

  return { rank:rank, churn: churn };

};


// Register model.
mongoose.model('Vote', VoteSchema);
var Vote = mongoose.model('Vote');

// Expose the schema.
module.exports = {
  VoteSchema: VoteSchema
};
