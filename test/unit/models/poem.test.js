/*
 * Unit tests for poem model.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  async = require('async'),
  assert = require('assert');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../db-connect');

// User model.
require('../../../app/models/user');
var User = mongoose.model('User');

// Poem model.
require('../../../app/models/poem');
var Poem = mongoose.model('Poem');


/*
 * ----------------------
 * Poem model unit tests.
 * ----------------------
 */


describe('Poem', function() {

  var user;

  beforeEach(function(done) {

    // Create user.
    user = new User({
      username:   'david',
      password:   'password',
      email:      'david@test.com',
      superUser:  true,
      active:     true
    });

    // Save.
    user.save(function(err) { done(); });

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
    async.map([User, Poem], remove, function(err, models) {
      done();
    });

  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create poem empty fields, manually set created field
      // to override the default.
      var poem = new Poem();
      poem.created = null;

      // Save.
      poem.save(function(err) {

        // Check for errors.
        err.errors.slug.type.should.eql('required');
        err.errors.user.type.should.eql('required');
        err.errors.created.type.should.eql('required');
        err.errors.roundLength.type.should.eql('required');
        err.errors.sliceInterval.type.should.eql('required');
        err.errors.minSubmissions.type.should.eql('required');
        err.errors.submissionVal.type.should.eql('required');
        err.errors.decayLifetime.type.should.eql('required');
        err.errors.seedCapital.type.should.eql('required');

        // Check for 0 documents.
        Poem.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

  });

  describe('field defaults', function() {

    var poem;

    beforeEach(function(done) {

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

      poem.save(function(err) { done(); });

    });

    it('should set "created" to the current date by default', function() {
      poem.created.should.be.ok;
    });

    it('should set "started" to false by default', function() {
      poem.started.should.be.false;
    });

    it('should set "running" to false by default', function() {
      poem.running.should.be.false;
    });

    it('should set "complete" to false by default', function() {
      poem.running.should.be.false;
    });

  });

  describe('validators', function() {

    var poem;

    beforeEach(function() {

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

    });

    describe('started', function() {

      describe('is false', function() {

        beforeEach(function() {
          poem.started = false;
        });

        it('should block when running is true', function(done) {
          poem.running = true;
          poem.save(function(err) {
            err.errors.started.should.be.ok;
            done();
          });
        });

        it('should block when complete is true', function(done) {
          poem.complete = true;
          poem.save(function(err) {
            err.errors.started.should.be.ok;
            done();
          });
        });

      });

    });

    describe('running', function() {

      describe('is true', function() {

        beforeEach(function() {
          poem.running = true;
        });

        it('should block when started is false', function(done) {
          poem.started = false;
          poem.save(function(err) {
            err.errors.running.should.be.ok;
            done();
          });
        });

        it('should block when complete is true', function(done) {
          poem.complete = false;
          poem.save(function(err) {
            err.errors.running.should.be.ok;
            done();
          });
        });

      });

    });

    describe('complete', function() {

      describe('is true', function() {

        beforeEach(function() {
          poem.complete = true;
        });

        it('should block when started is false', function(done) {
          poem.started = false;
          poem.save(function(err) {
            err.errors.complete.should.be.ok;
            done();
          });
        });

        it('should block when running is true', function(done) {
          poem.running = true;
          poem.save(function(err) {
            err.errors.complete.should.be.ok;
            done();
          });
        });

      });

    });

    describe('valid permutations', function() {

      it('should pass with !started, !running, !complete', function(done) {
        poem.started = false;
        poem.running = false;
        poem.complete = false;
        poem.save(function(err) {
          assert(!err);
          done();
        });
      });

      it('should pass with started, running, !complete', function(done) {
        poem.started = true;
        poem.running = true;
        poem.complete = false;
        poem.save(function(err) {
          assert(!err);
          done();
        });
      });

      it('should pass with started, !running, complete', function(done) {
        poem.started = true;
        poem.running = false;
        poem.complete = true;
        poem.save(function(err) {
          assert(!err);
          done();
        });
      });

    });

  });

  describe('virtual fields', function() {

    var poem;

    beforeEach(function(done) {

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

      poem.save(function(err) { done(); });

    });

    describe('id', function() {

      it('should have a virtual field for "id"', function() {
        poem.id.should.be.ok;
      });

      it('should be a string', function() {
        poem.id.should.be.a('string');
      });

    });

  });

  describe('methods', function() {

    var poem;

    beforeEach(function(done) {

      // Create poem.
      poem = new Poem({
        slug: 'test-poem',
        user: user.id,
        running: false,
        complete: false,
        roundLength : 10000,
        sliceInterval : 3,
        minSubmissions : 5,
        submissionVal : 100,
        decayLifetime : 50,
        seedCapital : 1000,
        visibleWords : 500
      });

      // Save and start.
      poem.save(function(err) {
        poem.start(function() {
          done();
        });
      });

    });

    // Stop and clear timers global.
    afterEach(function(done) {
      poem.stop(function() {
        global.Oversoul.timers = {};
        done();
      });
    });

    describe('start', function() {

      it('should register the slicer in the tracker object', function() {
        global.Oversoul.timers.should.have.keys(poem.id);
      });

      it('should set "running" to true', function() {
        poem.running.should.be.true;
      });

    });

    describe('stop', function() {

      beforeEach(function(done) {
        poem.stop(function() { done(); });
      });

      it('should remove the slicer from the tracker object', function() {
        global.Oversoul.timers.should.not.have.keys(poem.id);
      });

      it('should set "running" to false', function() {
        poem.running.should.be.false;
      });

    });

  });

});
