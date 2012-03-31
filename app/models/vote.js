/*
 * Vote model.
 */

// Module dependencies.
var _ = require('underscore');

// Schema definition.
var Vote = new Schema({
  word :            { type: String, required: true },
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
 * @param {Date}: The current Date.now().
 * @param {Number}: The mean decay lifetime.
 *
 * @return {Array}: [rank, churn].
 */
Vote.methods.score = function(now, decay) {

  // Get time delta.
  var delta = now - this.applied;

  // Compute churn.
  var churn = this.quantity *
    Math.pow(Math.E, (-delta / decay));

  // Starting boundary.
  var bound1 = this.quantity * -decay*
    Math.pow(Math.E, 0);

  // Current boundary.
  var bound2 = this.quantity * -decay*
    Math.pow(Math.E, (-delta / decay));

  return [bound2-bound1, churn];

};


// Register model.
mongoose.model('Vote', Vote);
var Vote = mongoose.model('Vote');
