/*
 * Round model.
 */

// Module dependencies.
var _ = require('underscore');

// Schema definition.
var RoundSchema = new Schema({
  started : {
    type: Date,
    'default': Date.now,
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
RoundSchema.virtual('id').get(function() {
  return this._id.toHexString();
});


/*
 * -----------------
 * Document methods.
 * -----------------
 */


/*
 * Register the round in memory.
 *
 * @return void.
 */
RoundSchema.methods.register = function() {
  global.Oversoul.votes[this.id] = {};
};


// Register model.
mongoose.model('Round', RoundSchema);
var Round = mongoose.model('Round');

// Expose the schema.
module.exports = {
  RoundSchema: RoundSchema
};
