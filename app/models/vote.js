/*
 * Vote model.
 */

// Module dependencies.
var _ = require('underscore');

// Schema definition.
var Vote = new Schema({
  word :            { type: Schema.ObjectId, ref: 'Word', required: true, index: true },
  quantity :        { type: Number, required: true },
  applied :         { type: Date, default: Date.now(), required: true }
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
Vote.virtual('id').get(function() {
  return this._id.toHexString();
});

/*
 * Score the vote.
 *
 * @param {Date}: The current Date.
 * @param {Number}: The mean decay lifetime.
 *
 * @return {Array}: [rank, churn].
 */
Vote.methods.score = function(now, decay) {

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

  return [rank, churn];

};


// Register model.
mongoose.model('Vote', Vote);
var Vote = mongoose.model('Vote');
