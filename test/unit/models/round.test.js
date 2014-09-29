
/**
 * Unit tests for round model.
 */

var _t = require('../../dependencies.js');
var should = require('should');

describe('Round', function() {

  var round;

  // Create round.
  beforeEach(function() {
    round = new _t.Round();
  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create round, override defaults.
      var round = new _t.Round();
      round.started = null;

      // Save.
      round.save(function(err) {

        // Check for errors.
        err.errors.started.type.should.eql('required');

        // Check for 0 documents.
        _t.Round.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

  });

  describe('field defaults', function() {

    it('should set "started" by default', function() {
      round.started.should.be.ok;
    });

  });

  describe('virtual fields', function() {

    describe('id', function() {

      it('should have a virtual field for "id"', function() {
        should.exist(round.id);
      });

      it('should be a string', function() {
        round.id.should.be.a.String;
      });

    });

  });

  describe('methods', function() {

    describe('register', function() {

      it('should create the empty votes tracker', function() {
        round.register();
        global.Oversoul.votes.should.have.keys(round.id);
      });

    });

  });

});
