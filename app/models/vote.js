/*
 * Vote model.
 */

// Module dependencies.
var _ = require('underscore');

// Schema definition.
var VoteSchema = new Schema({
  round : {
    type: Schema.ObjectId,
    ref: 'Round',
    required: true
  },
  applied : {
    type: Date,
    required: true
  },
  word : {
    type: String,
    required: true
  },
  quantity : {
    type: Number,
    required: true
  }
});


/*
 * -----------
 * Middleware.
 * -----------
 */


/*
 * Register the vote in memory.
 *
 * @return void.
 */
VoteSchema.pre('save', function(next) {

  var vote = [this.quantity, this.applied];

  // If a tracker for the word exists.
  if (_.has(global.Oversoul.votes[this.round], this.word)) {
    global.Oversoul.votes[this.round][this.word].push(vote);
  }

  // Set votes tracker.
  else {
    global.Oversoul.votes[this.round][this.word] = [vote];
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


// Register model.
mongoose.model('Vote', VoteSchema);
var Vote = mongoose.model('Vote');

// Expose the schema.
module.exports = {
  VoteSchema: VoteSchema
};
