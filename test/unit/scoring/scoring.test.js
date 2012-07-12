/*
 * Unit tests for scoring routine.
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

// Scoring module.
var scoring = require('../../../app/scoring/scoring');

/*
 * ---------------------------
 * Scoring routine unit tests.
 * ---------------------------
 */


describe('Scoring', function() {

  var user;

  beforeEach(function() {

    // Create user.
    user = new User({
      username: 'david',
      password: 'password',
      email: 'david@test.org'
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
    async.map([
      User,
      Poem
    ], remove, function(err, models) {
      done();
    });

  });

  describe('compute', function() {

    var result;

    beforeEach(function() {
      result = scoring.compute(100, 0, 500, 1/500, 1000);
    });

    it('should return the correct rank', function() {

      // Check rank value.
      result[0].should.eql(
        Math.round(
          (500*100*-(Math.exp(-1000 * 1/500)) -
          500*100*-(Math.exp(0))) * 0.001
        )
      );

    });

    it('should return the correct churn', function() {

      // Check churn value.
      result[1].should.eql(
        Math.round(100*Math.exp(-1000 * 1/500))
      );

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

  describe('score', function() {

    var poem, round;

    beforeEach(function(done) {

      // Create poem.
      poem = new Poem({
        slug: 'test-poem',
        user: user.id,
        started: true,
        running: true,
        roundLength : 10000,
        sliceInterval : 3,
        minSubmissions : 5,
        submissionVal : 100,
        decayLifetime : 50000,
        seedCapital : 1000,
        visibleWords : 2
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

        // Apply votes.
        poem.vote('first', 100);
        poem.vote('second', 200);
        poem.vote('third', 300);

        // Save.
        poem.save(function(err) {
          done();
        });

      });

      describe('when the round is not expired', function() {

        it('should broadcast stacks', function(done) {

          // Score the poem.
          scoring.score(poem.id, Date.now()+10, function(result) {

            // Check order.
            result.stack[0][0].should.eql('third');
            result.stack[1][0].should.eql('second');
            should.not.exist(result.stack[2]);

            // Check ratios.
            result.stack[0][3].should.eql('1.00');
            Number(result.stack[1][3]).should.be.below(1);
            done();

          }, function() {});

        });

        it('should broadcast poem', function(done) {

          // Score the poem.
          scoring.score(poem.id, Date.now(), function(result) {

            // Check poem.
            result.poem[0][0].valueOf().should.eql('it');
            result.poem[0][1].valueOf().should.eql('is');
            done();

          }, function() {});

        });

        it('should broadcast syllable count', function(done) {

          // Score the poem.
          scoring.score(poem.id, Date.now(), function(result) {

            // Check poem.
            result.syllables.should.eql(2);
            done();

          }, function() {});

        });

        it('should broadcast round id', function(done) {

          // Score the poem.
          scoring.score(poem.id, Date.now(), function(result) {

            // Check poem.
            result.round.should.eql(poem.round.id);
            done();

          }, function() {});

        });

        it('should broadcast clock', function(done) {

          // Score the poem.
          scoring.score(poem.id, Date.now(), function(result) {

            // Check clock.
            result.clock.should.be.above(0);
            done();

          }, function() {});

        });

      });

      describe('when the round is expired', function() {

        beforeEach(function(done) {

          // Set poem round expired.
          poem.round.started = Date.now() - 20000;
          poem.save(function(err) { done(); });

        });

        it('should broadcast updated poem', function(done) {

          // Score the poem.
          scoring.score(poem.id, Date.now(), function(result) {

            // Check poem.
            result.poem[0][0].valueOf().should.eql('it');
            result.poem[0][1].valueOf().should.eql('is');
            result.poem[0][2].valueOf().should.eql('third');
            done();

          }, function() {});

        });

        it('should broadcast empty stacks', function(done) {

          // Score the poem.
          scoring.score(poem.id, Date.now(), function(result) {

            // Check stack.
            result.stack.should.eql([]);
            done();

          }, function() {});

        });

        it('should save updated poem', function(done) {

          // Score the poem.
          scoring.score(poem.id, Date.now(), function() {}, function(result) {

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
          scoring.score(poem.id, Date.now(), function() {}, function(result) {

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
            scoring.score(poem.id, Date.now(), function(result) {

              // Check for poem.
              result.poem[0][0].valueOf().should.eql('it');
              result.poem[0][1].valueOf().should.eql('is');
              should.not.exist(result.poem[2]);
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
            scoring.score(poem.id, Date.now(), function() {}, function(result) {

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
