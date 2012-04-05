/*
 * Unit tests for poem model.
 */

// Module dependencies.
var vows = require('mocha');
var should = require('should');
var async = require('async');
var assert = require('assert');
var sinon = require('sinon');
var _ = require('underscore');

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

// Vote model.
require('../../../app/models/vote');
var Vote = mongoose.model('Vote');


/*
 * ----------------------
 * Poem model unit tests.
 * ----------------------
 */


describe('Poem', function() {

  var user;

  beforeEach(function() {

    // Create user.
    user = new User({
      username:   'david',
      password:   'password',
      email:      'david@test.com',
      active:     true
    });

  });

  // Clear votes object.
  afterEach(function() {
    global.Oversoul.votes = {};
    global.Oversoul.words = {};
  });

  after(function(done) {

    // Truncate worker.
    var remove = function(model, callback) {
      model.collection.remove(function(err) {
        callback(err, model);
      });
    };

    // Clear users and poems.
    async.map([User, Poem], remove, function(err, models) {
      done();
    });

  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create poem, override defaults.
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

    it('should set "created" to the current date by default', function() {
      poem.created.should.be.ok;
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

    describe('id', function() {

      it('should have a virtual field for "id"', function() {
        should.exist(poem.id);
      });

      it('should be a string', function() {
        poem.id.should.be.a('string');
      });

    });

    describe('unstarted', function() {

      it('should have a virtual field for "unstarted"', function() {
        should.exist(poem.unstarted);
      });

      it('should be true when started=false', function() {
        poem.started = false;
        poem.unstarted.should.be.true;
      });

      it('should be false when started=true', function() {
        poem.started = true;
        poem.unstarted.should.be.false;
      });

    });

    describe('paused', function() {

      it('should have a virtual field for "paused"', function() {
        should.exist(poem.paused);
      });

      it('should be false when the poem is running', function() {
        poem.running = true;
        poem.paused.should.be.false;
      });

      it('should be false when the poem is complete', function() {
        poem.complete = true;
        poem.paused.should.be.false;
      });

      it('should be true when the poem is started, not running, and not complete', function() {
        poem.started = true;
        poem.running = false;
        poem.complete = false;
        poem.paused.should.be.true;
      });

    });

    describe('status', function() {

      it('should have a virtual field for "status"', function() {
        should.exist(poem.status);
      });

      it('should return "unstarted" for unstarted poem', function() {
        poem.started = false;
        poem.status.should.eql('unstarted');
      });

      it('should return "paused" for paused poem', function() {
        poem.started = true;
        poem.running = false;
        poem.complete = false;
        poem.status.should.eql('paused');
      });

      it('should return "running" for running poem', function() {
        poem.started = true;
        poem.running = true;
        poem.complete = false;
        poem.status.should.eql('running');
      });

      it('should return "complete" for complete poem', function() {
        poem.started = true;
        poem.running = false;
        poem.complete = true;
        poem.status.should.eql('complete');
      });

    });

    describe('round', function() {

      it('should return the round when a round exists', function() {

        // Create first round.
        poem.newRound();
        poem.round.id.should.eql(poem.rounds[0].id);

        // Create second round.
        poem.newRound();
        poem.round.id.should.eql(poem.rounds[1].id);

      });

      it('should return null when a round does not exist', function() {
        should.not.exist(poem.round);
      });

    });

    describe('roundExpiration', function() {

      it('should return the correct expiration when a round exists', function() {

        // Create first round.
        poem.newRound();

        // Expiration = round started + round length.
        poem.roundExpiration.should.eql(
          poem.rounds[0].started.valueOf() + poem.roundLength
        );

        // Create second round.
        poem.newRound();

        // Expiration = round started + round length.
        poem.roundExpiration.should.eql(
          poem.rounds[1].started.valueOf() + poem.roundLength
        );

      });

      it('should return undefined when a round does not exist', function() {
        should.strictEqual(undefined, poem.roundExpiration);
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
        roundLength : 10000,
        sliceInterval : 3,
        minSubmissions : 5,
        submissionVal : 100,
        decayLifetime : 50,
        seedCapital : 1000,
        visibleWords : 500
      });

      // Save.
      poem.save(function(err) {
        done();
      });

    });

    describe('start', function() {

      // Start.
      beforeEach(function(done) {
        poem.start(function() {}, function() {}, function(err) {
          done();
        });
      });

      // Stop and clear timers global.
      afterEach(function(done) {
        poem.stop(function() {
          global.Oversoul.timers = {};
          done();
        });
      });

      it('should register the slicer in the tracker object', function() {
        global.Oversoul.timers.should.have.keys(poem.id);
      });

      it('should set "running" to true', function() {
        poem.running.should.be.true;
      });

      it('should set "started" to true', function() {
        poem.started.should.be.true;
      });

      it('should not double-start a poem', function(done) {

        // Spy on callback.
        var cb = sinon.spy(function(err) {
          sinon.assert.calledWith(cb,
            Error('Timer for ' + poem.id + ' is already running.'));
          done();
        });

        // Attempt to double-start, listen for error.
        poem.start(function() {}, function() {}, cb);

      });

    });

    describe('stop', function() {

      // Start.
      beforeEach(function(done) {
        poem.start(function() {}, function() {}, function(err) {
          poem.stop(function() { done(); });
        });
      });

      // Stop and clear timers global.
      afterEach(function(done) {
        poem.stop(function() {
          global.Oversoul.timers = {};
          done();
        });
      });

      it('should remove the slicer from the tracker object', function() {
        global.Oversoul.timers.should.not.have.keys(poem.id);
      });

      it('should set "running" to false', function() {
        poem.running.should.be.false;
      });

    });

    describe('addWord', function() {

      it('should append the new word to the poem array', function() {

        // Add first word.
        poem.addWord('electrical');
        poem.words[0].should.eql('electrical');

        // Add second word.
        poem.addWord('days');
        poem.words[0].should.eql('electrical');
        poem.words[1].should.eql('days');

      });

    });

    describe('newRound', function() {

      it('should add a new round', function() {

        // By default, rounds = [];
        poem.rounds.should.be.empty;

        // Add first round.
        poem.newRound();

        // Check for well-formed round.
        poem.rounds.length.should.eql(1);
        should.exist(poem.rounds[0].id);
        should.exist(poem.rounds[0].started);

        // Add a second round.
        poem.newRound();

        // Check for well-formed round.
        poem.rounds.length.should.eql(2);
        should.exist(poem.rounds[1].id);
        should.exist(poem.rounds[1].started);

      });

      it('should return the new round', function() {

        // Add new round.
        var round = poem.newRound();

        // Check for well-formed round.
        should.exist(round.id);
        should.exist(round.started);

      });

      it('should create a new votes array on globals', function() {

        // Add round.
        var round = poem.newRound();
        global.Oversoul.votes.should.have.keys(round.id);

      });

    });

  });

  describe('statics', function() {

    var poem, round;

    beforeEach(function(done) {

      // Create poem.
      poem = new Poem({
        slug: 'test-poem',
        user: user.id,
        roundLength : 10000,
        sliceInterval : 3,
        minSubmissions : 5,
        submissionVal : 100,
        decayLifetime : 60000,
        seedCapital : 1000,
        visibleWords : 2
      });

      // Initialize votes and words trackers.
      global.Oversoul.votes = {};
      global.Oversoul.words = {};

      // Create round.
      round = poem.newRound();

      // Add words.
      poem.addWord('it');
      poem.addWord('is');

      // Save.
      poem.save(function(err) {
        done();
      });

    });

    describe('score', function() {

      beforeEach(function() {

        // Populate words tracker.
        global.Oversoul.words[round.id] = {
          'word1': 0,
          'word2': 0,
          'word3': 0
        };

        // 100 vote on word1.
        global.Oversoul.votes[round.id].push(
          new Vote({
            word: 'word1',
            quantity: 100
          })
        );

        // 100 vote on word1.
        global.Oversoul.votes[round.id].push(
          new Vote({
            word: 'word1',
            quantity: 100
          })
        );

        // 200 vote on word2.
        global.Oversoul.votes[round.id].push(
          new Vote({
            word: 'word2',
            quantity: 200
          })
        );

        // 200 vote on word2.
        global.Oversoul.votes[round.id].push(
          new Vote({
            word: 'word2',
            quantity: 200
          })
        );

        // 300 vote on word3.
        global.Oversoul.votes[round.id].push(
          new Vote({
            word: 'word3',
            quantity: 300
          })
        );

        // 300 vote on word3.
        global.Oversoul.votes[round.id].push(
          new Vote({
            word: 'word3',
            quantity: 300
          })
        );

      });

      it('should return stacks', function(done) {

        // Score the poem.
        Poem.score(poem.id, function(result) {

          // Check rank.
          result.stacks.rank[0][0].should.eql('word3');
          result.stacks.rank[1][0].should.eql('word2');
          should.not.exist(result.stacks.rank[2]);

          // Check churn.
          result.stacks.churn[0][0].should.eql('word3');
          result.stacks.churn[1][0].should.eql('word2');
          should.not.exist(result.stacks.churn[2]);
          done();

        }, function() {});

      });

      it('should return poem', function(done) {

        // Score the poem.
        Poem.score(poem.id, function(result) {

          // Check for poem.
          result.poem[0].valueOf().should.eql('it');
          result.poem[1].valueOf().should.eql('is');
          done();

        }, function() {});

      });

      it('should return the round id', function(done) {

        // Score the poem.
        Poem.score(poem.id, function(result) {

          // Check for round id.
          result.round.should.eql(round.id);
          done();

        }, function() {});

      });

      it('should not start new round when the current round is not expired', function(done) {

        // Set poem round unexpired.
        poem.round.started = Date.now();

        // Capture round and poem ids.
        var poemId = poem.id;
        var roundId = poem.round.id;

        // Save.
        poem.save(function(err) {

          // Score the poem.
          Poem.score(poem.id, function() {}, function() {

            // Get the poem.
            var poem = Poem.findById(poemId, function(err, poem) {

              // Check for unchanged round.
              poem.round.id.should.eql(roundId);
              poem.rounds.length.should.eql(1);
              done();

            });

          });

        });

      });

      it('should start new round and lock the winner when the current round is expired', function(done) {

        // Set poem round expired.
        poem.round.started = Date.now() - 20000;

        // Capture round and poem ids.
        var poemId = poem.id;
        var roundId = poem.round.id;

        // Save.
        poem.save(function(err) {

          // Score the poem.
          Poem.score(poem.id, function() {}, function() {

            // Get the poem.
            var poem = Poem.findById(poemId, function(err, poem) {

              // Check for new round.
              poem.round.id.should.not.eql(roundId);
              poem.rounds.length.should.eql(2);

              // Check for new word.
              poem.words[2].valueOf().should.eql('word3');
              done();

            });

          });

        });

      });

    });

  });

});
