/*
 * Unit tests for poem model.
 */

// Modules
// -------
var mocha = require('mocha');
var should = require('should');
var assert = require('assert');
var async = require('async');
var sinon = require('sinon');
var config = require('yaml-config');
var mongoose = require('mongoose');
var helpers = require('../../helpers');
var _ = require('underscore');


// Models
// ------

// User.
require('../../../app/models/user');
var User = mongoose.model('User');

// Poem.
require('../../../app/models/poem');
var Poem = mongoose.model('Poem');

// Vote.
require('../../../app/models/vote');
var Vote = mongoose.model('Vote');


// Config
// ------

var root = config.readConfig('test/config.yaml').root;


// Run
// ---

process.env.NODE_ENV = 'testing';
var server = require('../../../app');


// Specs
// -----

describe('Poem', function() {

  var user, poem;

  beforeEach(function(done) {

    // Create user.
    user = new User({
      username: 'david',
      password: 'password',
      email: 'david@test.org'
    });

    // Create poem.
    poem = new Poem({
      user: user.id,
      roundLengthValue : 3,
      roundLengthUnit : 'minutes',
      sliceInterval: 300,
      minSubmissions: 5,
      submissionVal : 100,
      decayLifetime : 50,
      seedCapital : 1000,
      visibleWords : 500
    });

    // Save.
    user.save(function(err) {
      poem.save(function(err) {
        done();
      });
    });

  });

  // Clear votes object.
  afterEach(function() {
    global.Oversoul.votes = {};
    global.Oversoul.timers = {};
  });

  after(function(done) {

    // Clear users and poems.
    async.map([
      User,
      Poem
    ], helpers.remove, function(err, models) {
      done();
    });

  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create poem.
      var poem = new Poem();

      // Overrids defaults.
      poem.created = null;
      poem.started = null;
      poem.running = null;
      poem.complete = null;
      poem.published = null;

      // Save.
      poem.save(function(err) {

        // Check for errors.
        err.errors.created.type.should.eql('required');
        err.errors.started.type.should.eql('required');
        err.errors.running.type.should.eql('required');
        err.errors.complete.type.should.eql('required');
        err.errors.published.type.should.eql('required');
        err.errors.roundLengthValue.type.should.eql('required');
        err.errors.roundLengthUnit.type.should.eql('required');
        err.errors.sliceInterval.type.should.eql('required');
        err.errors.minSubmissions.type.should.eql('required');
        err.errors.submissionVal.type.should.eql('required');
        err.errors.decayLifetime.type.should.eql('required');
        err.errors.seedCapital.type.should.eql('required');

        // Check for 0 documents.
        Poem.count({}, function(err, count) {
          count.should.eql(1);
          done();
        });

      });

    });

  });

  describe('field defaults', function() {

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

    it('should set "published" to true by default', function() {
      poem.published.should.be.true;
    });

  });

  describe('validators', function() {

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

    describe('valid status permutations', function() {

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

    describe('roundLengthUnit', function() {

      it('should pass with "seconds"', function(done) {
        poem.roundLengthUnit = 'seconds';
        poem.save(function(err) {
          assert(!err);
          done();
        });
      });

      it('should pass with "minutes"', function(done) {
        poem.roundLengthUnit = 'minutes';
        poem.save(function(err) {
          assert(!err);
          done();
        });
      });

      it('should block invalid unit', function(done) {
        poem.roundLengthUnit = 'invalid';
        poem.save(function(err) {
          err.errors.roundLengthUnit.should.be.ok;
          done();
        });
      });

    });

  });

  describe('virtual fields', function() {

    describe('id', function() {

      it('should have a virtual field for "id"', function() {
        assert.exist(poem.id);
      });

      it('should be a string', function() {
        poem.id.should.be.a('string');
      });

    });

    describe('unstarted', function() {

      it('should have a virtual field for "unstarted"', function() {
        assert.exist(poem.unstarted);
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
        assert.exist(poem.paused);
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
        assert.not.exist(poem.round);
      });

    });

    describe('roundLength', function() {

      it('should convert from seconds', function() {
        poem.roundLengthValue = 30;
        poem.roundLengthUnit = 'seconds';
        poem.roundLength.should.eql(30000);
      });

      it('should convert from minutes', function() {
        poem.roundLengthValue = 3;
        poem.roundLengthUnit = 'minutes';
        poem.roundLength.should.eql(180000);
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

      it('should return null when a round does not exist', function() {
        assert(!poem.roundExpiration);
      });

    });

    describe('syllableCount', function() {

      it('should return 0 for no words', function() {

        // 0 words.
        poem.words = [];
        poem.syllableCount.should.eql(0);

      });

      it('should return count for < 1 full line', function() {

        // < 1 line.
        poem.words = [
          ['it', 'little']
        ];

        poem.syllableCount.should.eql(3);

      });

      it('should return count for 1 full line', function() {

        // 1 line.
        poem.words = [
          ['it', 'little', 'profits']
        ];

        poem.syllableCount.should.eql(5);

      });

      it('should return count for < 2 full lines', function() {

        // < 2 lines.
        poem.words = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle']
        ];

        poem.syllableCount.should.eql(9);

      });

      it('should return count for 2 full lines', function() {

        // 2 lines.
        poem.words = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this']
        ];

        poem.syllableCount.should.eql(12);

      });

      it('should return count for < 3 full lines', function() {

        // < 3 lines.
        poem.words = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this'],
          ['still', 'hearth']
        ];

        poem.syllableCount.should.eql(14);

      });

      it('should return count for 3 full lines', function() {

        // 3 lines.
        poem.words = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this'],
          ['still', 'hearth', 'among', 'these']
        ];

        poem.syllableCount.should.eql(17);

      });

    });

  });

  describe('methods', function() {

    describe('start', function() {

      // Stop and clear timers global.
      afterEach(function() {
        poem.stop();
      });

      it('should register the timer on the tracker', function() {

        // Start.
        poem.start(function() {}, function() {}).should.be.true;

        // Check for key on timers hash.
        global.Oversoul.timers.should.have.keys(poem.id);

      });

      it('should set "running" to true', function() {

        // Start.
        poem.start(function() {}, function() {}).should.be.true;

        // Check running.
        poem.running.should.be.true;

      });

      it('should set "started" to true', function() {

        // Start.
        poem.start(function() {}, function() {}).should.be.true;

        // Check started.
        poem.started.should.be.true;

      });

      it('should not double-start a poem', function() {

        // Start.
        poem.start(function() {}, function() {}).should.be.true;

        // Attempt to double-start.
        poem.start(function() {}, function() {}).should.be.false;

      });

    });

    describe('stop', function() {

      // Start.
      beforeEach(function() {
        poem.start(function() {}, function() {});
      });

      // Clear timers global.
      afterEach(function() {
        global.Oversoul.timers = {};
      });

      it('should remove the slicer from the tracker object', function() {

        // Stop.
        poem.stop();

        // Check for no key in timers hash.
        global.Oversoul.timers.should.not.have.keys(poem.id);

      });

      it('should set "running" to false', function() {

        // Stop.
        poem.stop();

        // Check running.
        poem.running.should.be.false;

      });

      it('should set "complete" to true when 17 syllables', function() {

        // Set complete.
        poem.words = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this'],
          ['still', 'hearth', 'among', 'these']
        ];

        // Stop.
        poem.stop();

        // Check complete.
        poem.complete.should.be.true;

      });

    });

    describe('addWord', function() {

      it('should lowercase the word', function() {

        // Add word with capital letters.
        poem.addWord('WoRd');
        poem.words[0].should.eql(['word']);

      });

      it('should reject non-word', function() {

        // Add non-word.
        poem.addWord('mclucklepickle').should.be.false;

      });

      it('should create line 1 array when no words', function() {

        // Add first word.
        poem.addWord('it').should.be.true;
        poem.words[0].should.eql(['it']);
        poem.words.length.should.eql(1);

      });

      it('should add to line 1 when word fits', function() {

        // Set line 1 array.
        poem.words = [['it']];

        // Add word.
        poem.addWord('little').should.be.true;
        poem.words[0].should.eql(['it', 'little']);
        poem.words.length.should.eql(1);

      });

      it('should complete to line 1 when word fits', function() {

        // Set line 1 array.
        poem.words = [['it', 'little']];

        // Add word.
        poem.addWord('profits').should.be.true;
        poem.words[0].should.eql(['it', 'little', 'profits']);
        poem.words.length.should.eql(1);

      });

      it('should reject when word does not fit on line 1', function() {

        // Set line 1 array.
        poem.words = [['it', 'little']];

        // Add too-long word.
        poem.addWord('amazes').should.be.false;
        poem.words[0].should.eql(['it', 'little']);
        poem.words.length.should.eql(1);

      });

      it('should create line 2 when line 1 is full', function() {

        // Set line 1 array.
        poem.words = [['it', 'little', 'profits']];

        // Add word.
        poem.addWord('that').should.be.true;
        poem.words[0].should.eql(['it', 'little', 'profits']);
        poem.words[1].should.eql(['that']);
        poem.words.length.should.eql(2);

      });

      it('should add to line 2 when word fits', function() {

        // Set line 1 and 2 arrays.
        poem.words = [
          ['it', 'little', 'profits'],
          ['that']
        ];

        // Add word.
        poem.addWord('an').should.be.true;
        poem.words[0].should.eql(['it', 'little', 'profits']);
        poem.words[1].should.eql(['that', 'an']);
        poem.words.length.should.eql(2);

      });

      it('should complete line 2 when word fits', function() {

        // Set line 1 and 2 arrays.
        poem.words = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by']
        ];

        // Add word.
        poem.addWord('this').should.be.true;
        poem.words[0].should.eql(['it', 'little', 'profits']);
        poem.words[1].should.eql(['that', 'an', 'idle', 'king', 'by', 'this']);
        poem.words.length.should.eql(2);

      });

      it('should reject when word does not fit on line 2', function() {

        // Set line 1 and 2 arrays.
        poem.words = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king']
        ];

        // Add word.
        poem.addWord('elephant').should.be.false;
        poem.words[0].should.eql(['it', 'little', 'profits']);
        poem.words[1].should.eql(['that', 'an', 'idle', 'king']);
        poem.words.length.should.eql(2);

      });

      it('should create line 3 when line 2 is full', function() {

        // Set line 1 and 2 arrays.
        poem.words = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this']
        ];

        // Add word.
        poem.addWord('still').should.be.true;
        poem.words[0].should.eql(['it', 'little', 'profits']);
        poem.words[1].should.eql(['that', 'an', 'idle', 'king', 'by', 'this']);
        poem.words[2].should.eql(['still']);
        poem.words.length.should.eql(3);

      });

      it('should add to line 3 when word fits', function() {

        // Set line 1, 2, and 3 arrays.
        poem.words = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this'],
          ['still']
        ];

        // Add word.
        poem.addWord('hearth').should.be.true;
        poem.words[0].should.eql(['it', 'little', 'profits']);
        poem.words[1].should.eql(['that', 'an', 'idle', 'king', 'by', 'this']);
        poem.words[2].should.eql(['still', 'hearth']);
        poem.words.length.should.eql(3);

      });

      it('should complete line 3 when word fits', function() {

        // Set line 1, 2, and 3 arrays.
        poem.words = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this'],
          ['still', 'hearth', 'among']
        ];

        // Add word.
        poem.addWord('these').should.be.true;
        poem.words[0].should.eql(['it', 'little', 'profits']);
        poem.words[1].should.eql(['that', 'an', 'idle', 'king', 'by', 'this']);
        poem.words[2].should.eql(['still', 'hearth', 'among', 'these']);
        poem.words.length.should.eql(3);

      });

      it('should reject when word does not fit on line 3', function() {

        // Set line 1, 2, and 3 arrays.
        poem.words = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this'],
          ['still', 'hearth', 'among' ]
        ];

        // Add word.
        poem.addWord('daffodils').should.be.false;
        poem.words[0].should.eql(['it', 'little', 'profits']);
        poem.words[1].should.eql(['that', 'an', 'idle', 'king', 'by', 'this']);
        poem.words[2].should.eql(['still', 'hearth', 'among']);
        poem.words.length.should.eql(3);

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
        assert.exist(poem.rounds[0].id);
        assert.exist(poem.rounds[0].started);

        // Add a second round.
        poem.newRound();

        // Check for well-formed round.
        poem.rounds.length.should.eql(2);
        assert.exist(poem.rounds[1].id);
        assert.exist(poem.rounds[1].started);

      });

      it('should return the new round', function() {

        // Add new round.
        var round = poem.newRound();

        // Check for well-formed round.
        assert.exist(round.id);
        assert.exist(round.started);

      });

      it('should create a new votes object on global', function() {

        // Add round.
        var round = poem.newRound();
        global.Oversoul.votes[round.id].should.eql({});

      });

      it('should delete votes object for previous round', function() {

        // Add new round.
        var round1 = poem.newRound();

        // Vote 1.
        var vote1 = new Vote({
          round: poem.round.id,
          word: 'first',
          quantity: 100
        });

        // Vote 2.
        var vote2 = new Vote({
          round: poem.round.id,
          word: 'second',
          quantity: 200
        });

        // Vote 3.
        var vote3 = new Vote({
          round: poem.round.id,
          word: 'third',
          quantity: 300
        });

        // Register votes.
        vote1.register();
        vote2.register();
        vote3.register();

        // Check for current round votes.
        global.Oversoul.votes[round1.id].should.have.keys(
          'first',
          'second',
          'third'
        );

        // New round.
        var round2 = poem.newRound();

        // Check for round1 vote deletion.
        global.Oversoul.votes.should.not.have.keys(round1.id);
        global.Oversoul.votes.should.have.keys(round2.id);

      });

      it('should stop the poem if no votes in previous round', function() {

        // Spy on stop().
        poem.stop = sinon.spy();

        // Add new round.
        poem.newRound();

        // Add new round, check for stop().
        poem.newRound();
        sinon.assert.called(poem.stop);

      });

    });

    describe('timeLeftInRound', function() {

      it('should return the remaining time when a round exists', function() {

        // Add round, pass expiration - 1000.
        poem.newRound();

        // Pass expiration - 10000.
        var now = poem.roundExpiration-10000;
        poem.timeLeftInRound(now).should.eql(10000);

      });

      it('should return null when no round exists', function() {
        assert(!poem.timeLeftInRound(Date.now()));
      });

    });

  });

});
