
/**
 * Vote model.
 */

var _ = require('lodash');
var mongoose = require('mongoose');


var VoteSchema = new mongoose.Schema({
  round : {
    type: mongoose.Schema.ObjectId,
    ref: 'Round',
    required: true
  },
  session : {
    type: String,
    required: true
  },
  applied : {
    type: Date,
    required: true,
    'default': Date.now
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


/**
 * -------------------
 * Virtual attributes.
 * -------------------
 */


/**
 * Get id.
 *
 * @return {String}: The id.
 */
VoteSchema.virtual('id').get(function() {
  return this._id.toHexString();
});


/**
 * -----------
 * Middleware.
 * -----------
 */


/**
 * Call register on save.
 */
VoteSchema.pre('save', function(next) {
  this.register();
  next();
});


/**
 * -----------------
 * Document methods.
 * -----------------
 */


/**
 * Register the vote in memory.
 */
VoteSchema.methods.register = function() {

  var vote = [this.quantity, this.applied];

  // If a tracker for the word exists, add to it.
  if (_.has(global.Oversoul.votes[this.round], this.word)) {
    global.Oversoul.votes[this.round][this.word].push(vote);
  }

  // Otherwise, create the tracker.
  else {
    global.Oversoul.votes[this.round][this.word] = [vote];
  }

};


// Register model.
module.exports = mongoose.model('Vote', VoteSchema);
