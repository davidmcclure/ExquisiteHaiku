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
 * @return {Array}: [rank, churn].
 */
// Vote.methods.score = function(cb) {

//   // Get time delta.
//   var delta = this.applied - Date.now();

//   // Compute churn.
//   var churn = this.quantity * Math.pow(
//     Math.E, (-delta / this.decayLifetime)
//   );

//   // Starting boundary.
//   var bound1 = this.quantity * -this.decayLifetime * Math.pow(
//     Math.E, 0
//   );

//   // Current boundary.
//   var bound2 = this.quantity * -this.decayLifetime * Math.pow(
//     Math.E, (-delta / this.decayLifetime)
//   );

//   return [bound2-bound1, churn];

// };


// Register model.
mongoose.model('Vote', Vote);
var Vote = mongoose.model('Vote');
