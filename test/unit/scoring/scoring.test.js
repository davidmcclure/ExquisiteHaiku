/*
 * Unit tests for scoring routine.
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

// Round.
require('../../../app/models/round');
var Round = mongoose.model('Round');

// Vote.
require('../../../app/models/vote');
var Vote = mongoose.model('Vote');


// Config
// ------

// Scoring module.
var scoring = require('../../../app/scoring/scoring');


// Config
// ------

var root = config.readConfig('test/config.yaml').root;


// Run
// ---

process.env.NODE_ENV = 'testing';
var server = require('../../../app');


// Specs
// -----

describe('Scoring', function() {

  var user, now;

  beforeEach(function() {

    // Create user.
    user = new User({
      username: 'david',
      password: 'password',
      email: 'david@test.org'
    });

    // Capture current time.
    now = Date.now();

  });

  // Clear votes object.
  afterEach(function() {
    global.Oversoul.votes = {};
  });

  after(function(done) {

    // Clear users and poems.
    async.map([
      User,
      Poem,
      Round,
      Vote
    ], helpers.remove, function(err, models) {
      done();
    });

  });

  describe('compute', function() {

    var result;

    beforeEach(function() {
      result = scoring.compute(1, 0, 500, 1/500, 10000);
    });

    it('should return the correct rank', function() {
      var rank = Math.round(result[0]*10)/10;
      rank.should.eql(0.5);
    });

    it('should return the correct churn', function() {
      var churn = Math.round(result[1]);
      churn.should.eql(0);
    });

  });

  describe('merge', function() {

    var stack, score;

    beforeEach(function() {
      stack = [['word', 0, 0, 0]];
    });

    it('should add rank', function() {
      score = [100, 200];
      scoring.merge(stack, score);
      stack[0][1].should.eql(100);
    });

    it('should add negative churn', function() {
      score = [100, -200];
      scoring.merge(stack, score);
      stack[0][3].should.eql(-200);
    });

    it('should add positive churn', function() {
      score = [100, 200];
      scoring.merge(stack, score);
      stack[0][2].should.eql(200);
    });

  });

  describe('sort', function() {

    it('should sort on the second element', function() {

      var stack = [
        ['word1', 1],
        ['word2', 2],
        ['word3', 3]
      ];

      scoring.sort(stack).should.eql([
        ['word3', 3],
        ['word2', 2],
        ['word1', 1]
      ]);

    });

  });

  describe('ratios', function() {

    it('should add ratios to the stack', function() {

      var stack = [
        ['word3', 3],
        ['word2', 2],
        ['word1', 1]
      ];

      scoring.ratios(stack).should.eql([
        ['word3', 3, '1.00'],
        ['word2', 2, '0.67'],
        ['word1', 1, '0.33']
      ]);

    });

  });

  describe('round', function() {

    it('should round rank, +churn, -churn', function() {

      var stack = [
        ['word3', 3.14, 2.14, 1.14],
        ['word2', 2.14, 1.14, 0.14]
      ];

      scoring.round(stack).should.eql([
        ['word3', 3, 2, 1],
        ['word2', 2, 1, 0]
      ]);

    });

  });

  describe('score', function() {

    var poem, round;

    beforeEach(function(done) {

      // Create poem.
      poem = new Poem({
        user: user.id,
        started: true,
        running: true,
        roundLengthValue: 10,
        roundLengthUnit: 'seconds',
        sliceInterval: 300,
        minSubmissions: 5,
        submissionVal: 100,
        decayLifetime: 50000,
        seedCapital: 1000,
        visibleWords: 2
      });

      // Save.
      poem.save(function(err) {
        done();
      });

    });

    describe('score', function() {

      beforeEach(function(done) {

        // Initialize trackers.
        global.Oversoul.votes = {};

        // Create round.
        round = poem.newRound();

        // Add words.
        poem.addWord('it');
        poem.addWord('is');

        // Vote 1.
        var vote1 = new Vote({
          round: poem.round.id,
          word: 'first',
          quantity: 100,
          applied: now
        });

        // Vote 2.
        var vote2 = new Vote({
          round: poem.round.id,
          word: 'second',
          quantity: 200,
          applied: now
        });

        // Vote 3.
        var vote3 = new Vote({
          round: poem.round.id,
          word: 'third',
          quantity: 300,
          applied: now
        });

        // Save.
        async.map([
          poem,
          vote1,
          vote2,
          vote3
        ], helpers.save, function(err, documents) {
          done();
        });

      });

      describe('when the round is not expired', function() {

        it('should broadcast stacks', function(done) {

          // Score the poem.
          scoring.score(poem.id, now+1000, function(result) {

            // Check order.
            result.stack[0][0].should.eql('third');
            result.stack[1][0].should.eql('second');
            assert.not.exist(result.stack[2]);

            // Check ratios.
            result.stack[0][4].should.eql('1.00');
            Number(result.stack[1][4]).should.be.below(1);
            done();

          }, function() {});

        });

        it('should broadcast poem', function(done) {

          // Score the poem.
          scoring.score(poem.id, now+1000, function(result) {

            // Check poem.
            result.poem[0][0].valueOf().should.eql('it');
            result.poem[0][1].valueOf().should.eql('is');
            done();

          }, function() {});

        });

        it('should broadcast syllable count', function(done) {

          // Score the poem.
          scoring.score(poem.id, now+1000, function(result) {

            // Check poem.
            result.syllables.should.eql(2);
            done();

          }, function() {});

        });

        it('should broadcast round id', function(done) {

          // Score the poem.
          scoring.score(poem.id, now+1000, function(result) {

            // Check poem.
            result.round.should.eql(poem.round.id);
            done();

          }, function() {});

        });

        it('should broadcast clock', function(done) {

          // Score the poem.
          scoring.score(poem.id, now+1000, function(result) {

            // Check clock.
            result.clock.should.be.above(0);
            done();

          }, function() {});

        });

      });

      describe('when the round is expired', function() {

        beforeEach(function(done) {

          // Set poem round expired.
          poem.round.started = now - 20000;
          poem.save(function(err) { done(); });

        });

        it('should broadcast updated poem', function(done) {

          // Score the poem.
          scoring.score(poem.id, now, function(result) {

            // Check poem.
            result.poem[0][0].valueOf().should.eql('it');
            result.poem[0][1].valueOf().should.eql('is');
            result.poem[0][2].valueOf().should.eql('third');
            done();

          }, function() {});

        });

        it('should broadcast empty stacks', function(done) {

          // Score the poem.
          scoring.score(poem.id, now, function(result) {

            // Check stack.
            result.stack.should.eql([]);
            done();

          }, function() {});

        });

        it('should save updated poem', function(done) {

          // Score the poem.
          scoring.score(poem.id, now, function() {}, function(result) {

            // Get the poem.
            Poem.findById(poem.id, function(err, poem) {

              // Check for new word.
              poem.words[0][2].valueOf().should.eql('third');
              done();

            });

          });

        });

        it('should save updated round', function(done) {

          // Score the poem.
          scoring.score(poem.id, now, function() {}, function(result) {

            // Get the poem.
            Poem.findById(poem.id, function(err, poem) {

              // Check for new round.
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
            scoring.score(poem.id, now+1000, function(result) {

              // Check for poem.
              result.poem[0][0].valueOf().should.eql('it');
              result.poem[0][1].valueOf().should.eql('is');
              assert.not.exist(result.poem[2]);
              done();

            }, function() {});

          });

        });

        describe('when the poem is complete', function() {

          beforeEach(function(done) {

            // Set poem 1 syllable from completion.
            poem.words = [
              ['it', 'little', 'profits'],
              ['that', 'an', 'idle', 'king', 'by', 'this'],
              ['still', 'hearth', 'among' ]
            ];

            // Save.
            poem.markModified('words');
            poem.save(function(err) {
              done();
            });

          });

          it('should stop the poem', function(done) {

            // Score the poem.
            scoring.score(poem.id, now+1000, function() {}, function(result) {

              // Get the poem.
              Poem.findById(poem.id, function(err, poem) {

                // Check for stopped poem.
                poem.running.should.be.false;
                global.Oversoul.timers.should.not.have.keys(poem.id);
                done();

              });

            });

          });

        });

      });

    });

  });

});
