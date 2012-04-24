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
      password:   'password'
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

      it('should add to line 1 array when word fits', function() {

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
        decayLifetime : 50000,
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

        // 100 vote on first.
        global.Oversoul.votes[round.id].push(
          new Vote({
            word: 'first',
            quantity: 100
          })
        );

        // 200 vote on second.
        global.Oversoul.votes[round.id].push(
          new Vote({
            word: 'second',
            quantity: 200
          })
        );

        // 300 vote on third.
        global.Oversoul.votes[round.id].push(
          new Vote({
            word: 'third',
            quantity: 300
          })
        );

      });

      describe('when the round is not expired', function() {

        it('should return stacks', function(done) {

          // Score the poem.
          Poem.score(poem.id, Date.now(), function(result) {

            // Check rank order.
            result.stacks.rank[0][0].should.eql('third');
            result.stacks.rank[1][0].should.eql('second');
            should.not.exist(result.stacks.rank[2]);

            // Check churn order.
            result.stacks.churn[0][0].should.eql('third');
            result.stacks.churn[1][0].should.eql('second');
            should.not.exist(result.stacks.churn[2]);
            done();

          }, function() {});

        });

        it('should return poem', function(done) {

          // Score the poem.
          Poem.score(poem.id, Date.now(), function(result) {

            // Check for poem.
            result.poem[0][0].valueOf().should.eql('it');
            result.poem[0][1].valueOf().should.eql('is');
            done();

          }, function() {});

        });

        it('should return round id', function(done) {

          // Score the poem.
          Poem.score(poem.id, Date.now(), function(result) {

            // Check for original round id.
            result.round.should.eql(round.id);
            done();

          }, function() {});

        });

        it('should not save new poem', function(done) {

          Poem.score(poem.id, Date.now(), function() {}, function() {

            // Get the poem.
            Poem.findById(poem.id, function(err, poem) {

              // Check for no new word.
              should.not.exist(poem.words[2]);
              done();

            });

          });

        });

        it('should not save new round', function(done) {

          Poem.score(poem.id, Date.now(), function() {}, function() {

            // Get the poem.
            Poem.findById(poem.id, function(err, poem) {

              // Check for new word.
              poem.round.id.should.eql(round.id);
              done();

            });

          });

        });

      });

      describe('when the round is expired', function() {

        beforeEach(function(done) {

          // Set poem round expired.
          poem.round.started = Date.now() - 20000;
          poem.save(function(err) { done(); });

        });

        it('should return updated poem', function(done) {

          // Score the poem.
          Poem.score(poem.id, Date.now(), function(result) {

            // Check for poem.
            result.poem[0][0].valueOf().should.eql('it');
            result.poem[0][1].valueOf().should.eql('is');
            result.poem[0][2].valueOf().should.eql('third');
            done();

          }, function() {});

        });

        it('should return updated round id', function(done) {

          // Score the poem.
          Poem.score(poem.id, Date.now(), function(result) {

            // Check for new round id.
            result.round.should.not.eql(round.id);
            done();

          }, function() {});

        });

        it('should return empty stacks', function(done) {

          // Score the poem.
          Poem.score(poem.id, Date.now(), function(result) {

            // Check for empty stacks.
            result.stacks.rank.should.eql([]);
            result.stacks.churn.should.eql([]);
            done();

          }, function() {});

        });

        it('should save new poem', function(done) {

          Poem.score(poem.id, Date.now(), function() {}, function() {

            // Get the poem.
            Poem.findById(poem.id, function(err, poem) {

              // Check for new word.
              poem.words[0][2].valueOf().should.eql('third');
              done();

            });

          });

        });

        it('should save new round', function(done) {

          Poem.score(poem.id, Date.now(), function() {}, function() {

            // Get the poem.
            Poem.findById(poem.id, function(err, poem) {

              // Check for new word.
              poem.round.id.should.not.eql(round.id);
              done();

            });

          });

        });

        describe('when no words exist', function() {

          beforeEach(function() {

            // Empty trackers.
            global.Oversoul.votes = {};
            global.Oversoul.words = {};

          });

          it('should return unchanged poem', function(done) {

            // Score the poem.
            Poem.score(poem.id, Date.now(), function(result) {

              // Check for poem.
              result.poem[0][0].valueOf().should.eql('it');
              result.poem[0][1].valueOf().should.eql('is');
              should.not.exist(result.poem[2]);
              done();

            }, function() {});

          });

        });

      });

    });

  });

});
