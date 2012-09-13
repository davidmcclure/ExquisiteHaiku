/*
 * Unit tests for vote model.
 */

var _t = require('../../dependencies.js');

describe('Vote', function() {

  var round, vote;

  beforeEach(function() {

    // Create round.
    round = new _t.Round();

    // Create vote.
    vote = new _t.Vote({
      round: round.id,
      word: 'word',
      quantity: 100
    });

  });

  afterEach(function(done) {

    // Clear rounds and votes.
    _t.async.map([
      _t.Round,
      _t.Vote
    ], _t.helpers.remove, function(err, models) {
      done();
    });

  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create vote, override defaults.
      var vote = new _t.Vote();
      vote.applied = null;

      // Save.
      vote.save(function(err) {

        // Check for errors.
        err.errors.round.type.should.eql('required');
        err.errors.applied.type.should.eql('required');
        err.errors.word.type.should.eql('required');
        err.errors.quantity.type.should.eql('required');

        // Check for 0 documents.
        _t.Vote.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

  });

  describe('methods', function() {

    describe('register', function() {

      // Register round.
      beforeEach(function() {
        global.Oversoul.votes[vote.round] = {};
      });

      describe('when the word tracker exists', function() {

        // Register word tracker.
        beforeEach(function() {
          global.Oversoul.votes[vote.round][vote.word] = [];
        });

        it('should push the new vote', function() {

          // Register.
          vote.register();

          // Check for vote.
          var memoryVote = global.Oversoul.votes[vote.round][vote.word][0];
          memoryVote[0].should.eql(100);

        });

      });

      describe('when the word tracker does not exist', function() {

        it('should create the id key and push new vote', function() {

          // Register.
          vote.register();

          // Check for vote.
          var memoryVote = global.Oversoul.votes[vote.round][vote.word][0];
          memoryVote[0].should.eql(100);

        });

      });

    });

  });

  describe('virtual fields', function() {

    describe('id', function() {

      it('should have a virtual field for "id"', function() {
        _t.assert.exist(round.id);
      });

      it('should be a string', function() {
        round.id.should.be.a('string');
      });

    });

  });

});
