/*
 * Unit tests for round model.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  async = require('async'),
  assert = require('assert'),
  sinon = require('sinon');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../db-connect');

// User model.
require('../../../app/models/user');
var User = mongoose.model('User');

// Poem model.
require('../../../app/models/poem');
var Poem = mongoose.model('Poem');

// Round model.
require('../../../app/models/round');
var Round = mongoose.model('Round');


/*
 * -----------------------
 * Round model unit tests.
 * -----------------------
 */


describe('Round', function() {

  var user, poem, round;

  beforeEach(function(done) {

    // Create user.
    user = new User({
      username:   'david',
      password:   'password',
      email:      'david@test.com',
      active:     true
    });

    // Create poem.
    poem = new Poem({
      slug: 'test-poem',
      user: user.id,
      roundLength : 10000,
      sliceInterval : 3,
      minSubmissions : 5,
      submissionVal : 100,
      decayLifetime : 50,
      seedCapital : 1000,
      visibleWords : 500
    });

    // Create round.
    round = new Round({
      poem: poem.id
    });

    // Save worker.
    var save = function(document, callback) {
      document.save(function(err) {
        callback(null, document);
      });
    };

    // Save.
    async.map([
      user,
      poem,
      round
    ], save, function(err, documents) {
      done();
    });

  });

  // Clear users and poems.
  afterEach(function(done) {

    // Truncate worker.
    var remove = function(model, callback) {
      model.collection.remove(function(err) {
        callback(err, model);
      });
    };

    // Truncate.
    async.map([User, Poem, Round], remove, function(err, models) {
      done();
    });

  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create round, override defaults.
      var round = new Round();
      round.started = null;

      // Save.
      round.save(function(err) {

        // Check for errors.
        err.errors.poem.type.should.eql('required');
        err.errors.started.type.should.eql('required');

        // Check for 0 documents.
        Round.count({}, function(err, count) {
          count.should.eql(1);
          done();
        });

      });

    });

  });

  describe('field defaults', function() {

    it('should set "started" to the current date by default', function() {
      round.started.should.be.ok;
    });

  });

  describe('virtual fields', function() {

    describe('id', function() {

      it('should have a virtual field for "id"', function() {
        round.id.should.be.ok;
      });

      it('should be a string', function() {
        round.id.should.be.a('string');
      });

    });

  });

});
