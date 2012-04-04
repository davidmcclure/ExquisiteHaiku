/*
 * Vote model.
 */

// Module dependencies.
var _ = require('underscore');

// Schema definition.
var VoteSchema = new Schema({
  round :         { type: Schema.ObjectId, ref: 'Round', required: true },
  word :          { type: String, required: true },
  quantity :      { type: Number, required: true },
  applied :       { type: Date, default: Date.now(), required: true }
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
 * @param {Number} decay: The mean decay lifetime.
 *
 * @return {Array}: [rank, churn].
 */
VoteSchema.methods.score = function(now, decay) {

  // Get time delta.
  var delta = now - this.applied;

  // Compute churn.
  var churn = Math.round(this.quantity *
    Math.pow(Math.E, (-delta / decay)));

  // Starting boundary.
  var bound1 = this.quantity * -decay;

  // Current boundary.
  var bound2 = this.quantity * -decay *
    Math.pow(Math.E, (-delta / decay));

  // Get the integral, scale and round.
  var rank = Math.round(((bound2-bound1)/1000));

  return { rank:rank, churn: churn };

};


// Register model.
mongoose.model('Vote', VoteSchema);
var Vote = mongoose.model('Vote');

// Expose the schema.
module.exports = {
  VoteSchema: VoteSchema
};
