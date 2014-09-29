
/**
 * Unit tests for _t.scoring routine.
 */

var _t = require('../../dependencies.js');
var should = require('should');

describe('Scoring', function() {

  var user, now;

  beforeEach(function() {

    // Create user.
    user = new _t.User({
      username: 'david',
      password: 'password',
      email: 'david@test.org'
    });

    // Set lock ratio.
    global.config.lockRatio = 0.1;

    // Current time.
    now = Date.now();

  });

  // Clear votes object.
  afterEach(function() {
    global.Oversoul.votes = {};
  });

  after(function(done) {

    // Clear users and poems.
    _t.async.map([
      _t.User,
      _t.Poem,
      _t.Round,
      _t.Vote
    ], _t.helpers.remove, function(err, models) {
      done();
    });

  });

  describe('compute', function() {

    var result;

    beforeEach(function() {
      result = _t.scoring.compute(1, 0, 500, 1/500, 10000);
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
      _t.scoring.merge(stack, score);
      stack[0][1].should.eql(100);
    });

    it('should add negative churn', function() {
      score = [100, -200];
      _t.scoring.merge(stack, score);
      stack[0][3].should.eql(-200);
    });

    it('should add positive churn', function() {
      score = [100, 200];
      _t.scoring.merge(stack, score);
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

      _t.scoring.sort(stack).should.eql([
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

      _t.scoring.ratios(stack).should.eql([
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

      _t.scoring.round(stack).should.eql([
        ['word3', 3, 2, 1],
        ['word2', 2, 1, 0]
      ]);

    });

  });

  describe('locked', function() {

    it('should return false when no words', function() {

      // Empty stack.
      var stack = [];
      _t.scoring.locked(stack, 10000, 100).should.be.false;

    });

    it('should return false when 1 word', function() {

      // 1 word.
      var stack = [['word1', 100, 50, -50, '1.00']];
      _t.scoring.locked(stack, 10000, 100).should.be.false;

    });

    it('should return false when word 2 below threshold', function() {

      var stack = _t.scoring.ratios([
        ['word1', 10000, 50, -50],
        ['word2', 999, 50, -50]
      ]);

      _t.scoring.locked(stack, 10000, 100).should.be.false;

    });

    it('should return true when word 2 below lock ratio', function() {

      var stack = _t.scoring.ratios([
        ['word1', 20000, 50, -50],
        ['word2', 1000, 50, -50]
      ]);

      _t.scoring.locked(stack, 10000, 100).should.be.true;

    });

  });

  describe('score', function() {

    var poem, round;

    beforeEach(function(done) {

      // Create poem.
      poem = new _t.Poem({
        user: user.id,
        started: true,
        running: true,
        roundLengthValue: 10,
        roundLengthUnit: 'seconds',
        sliceInterval: 300,
        submissionVal: 100,
        decayHalflife: 50,
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
        var vote1 = new _t.Vote({
          round: poem.round.id,
          word: 'first',
          quantity: 100,
          applied: now
        });

        // Vote 2.
        var vote2 = new _t.Vote({
          round: poem.round.id,
          word: 'second',
          quantity: 200,
          applied: now
        });

        // Vote 3.
        var vote3 = new _t.Vote({
          round: poem.round.id,
          word: 'third',
          quantity: 300,
          applied: now
        });

        // Save.
        _t.async.map([
          poem,
          vote1,
          vote2,
          vote3
        ], _t.helpers.save, function(err, documents) {
          done();
        });

      });

      describe('when the round is not expired', function() {

        it('should broadcast stacks', function(done) {

          // Score the poem.
          _t.scoring.score(poem.id, now+1000, function(result) {

            // Check order.
            result.stack[0][0].should.eql('third');
            result.stack[1][0].should.eql('second');
            should.not.exist(result.stack[2]);

            // Check ratios.
            result.stack[0][4].should.eql('1.00');
            Number(result.stack[1][4]).should.be.below(1);
            done();

          }, function() {});

        });

        it('should broadcast poem', function(done) {

          // Score the poem.
          _t.scoring.score(poem.id, now+1000, function(result) {

            // Check poem.
            result.poem[0][0].valueOf().should.eql('it');
            result.poem[0][1].valueOf().should.eql('is');
            done();

          }, function() {});

        });

        it('should broadcast syllable count', function(done) {

          // Score the poem.
          _t.scoring.score(poem.id, now+1000, function(result) {

            // Check poem.
            result.syllables.should.eql(2);
            done();

          }, function() {});

        });

        it('should broadcast round id', function(done) {

          // Score the poem.
          _t.scoring.score(poem.id, now+1000, function(result) {

            // Check poem.
            result.round.should.eql(poem.round.id);
            done();

          }, function() {});

        });

        it('should broadcast clock', function(done) {

          // Score the poem.
          _t.scoring.score(poem.id, now+1000, function(result) {

            // Check clock.
            result.clock.should.be.above(0);
            done();

          }, function() {});

        });

      });

      // describe('when the top word wins by ratio', function() {

      //   beforeEach(function(done) {

      //     // Add new vote.
      //     var vote4 = new _t.Vote({
      //       round: poem.round.id,
      //       word: 'fourth',
      //       quantity: 10000,
      //       applied: now
      //     });

      //     // Save.
      //     vote4.save(function(err) {
      //       done();
      //     });

      //   });

      //   it('should broadcast updated poem', function(done) {

      //     // Score the poem.
      //     _t.scoring.score(poem.id, now+5000, function(result) {

      //       // Check poem.
      //       result.poem[0][0].valueOf().should.eql('it');
      //       result.poem[0][1].valueOf().should.eql('is');
      //       result.poem[0][2].valueOf().should.eql('fourth');
      //       done();

      //     }, function() {});

      //   });

      //   it('should broadcast empty stacks', function(done) {

      //     // Score the poem.
      //     _t.scoring.score(poem.id, now+5000, function(result) {

      //       // Check stack.
      //       result.stack.should.eql([]);
      //       done();

      //     }, function() {});

      //   });

      //   it('should save updated poem', function(done) {

      //     // Score the poem.
      //     _t.scoring.score(poem.id, now+5000, function() {}, function(result) {

      //       // Get the poem.
      //       _t.Poem.findById(poem.id, function(err, poem) {

      //         // Check for new word.
      //         poem.words[0][2].valueOf().should.eql('fourth');
      //         done();

      //       });

      //     });

      //   });

      //   it('should save updated round', function(done) {

      //     // Score the poem.
      //     _t.scoring.score(poem.id, now+5000, function() {}, function(result) {

      //       // Get the poem.
      //       _t.Poem.findById(poem.id, function(err, poem) {

      //         // Check for new round.
      //         poem.round.id.should.not.eql(round.id);
      //         done();

      //       });

      //     });

      //   });

      // });

      describe('when the round is expired', function() {

        beforeEach(function(done) {

          // Set poem round expired.
          poem.round.started = now - 20000;
          poem.save(function(err) { done(); });

        });

        it('should broadcast updated poem', function(done) {

          // Score the poem.
          _t.scoring.score(poem.id, now, function(result) {

            // Check poem.
            result.poem[0][0].valueOf().should.eql('it');
            result.poem[0][1].valueOf().should.eql('is');
            result.poem[0][2].valueOf().should.eql('third');
            done();

          }, function() {});

        });

        it('should broadcast empty stacks', function(done) {

          // Score the poem.
          _t.scoring.score(poem.id, now, function(result) {

            // Check stack.
            result.stack.should.eql([]);
            done();

          }, function() {});

        });

        it('should save updated poem', function(done) {

          // Score the poem.
          _t.scoring.score(poem.id, now, function() {}, function(result) {

            // Get the poem.
            _t.Poem.findById(poem.id, function(err, poem) {

              // Check for new word.
              poem.words[0][2].valueOf().should.eql('third');
              done();

            });

          });

        });

        it('should save updated round', function(done) {

          // Score the poem.
          _t.scoring.score(poem.id, now, function() {}, function(result) {

            // Get the poem.
            _t.Poem.findById(poem.id, function(err, poem) {

              // Check for new round.
              poem.round.id.should.not.eql(round.id);
              done();

            });

          });

        });

        describe('when no words exist', function() {

          beforeEach(function() {

            // Empty trackers.
            global.Oversoul.votes[poem.round.id] = [];

          });

          it('should return unchanged poem', function(done) {

            // Score the poem.
            _t.scoring.score(poem.id, now+1000, function(result) {

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
            _t.scoring.score(poem.id, now+1000, function() {}, function(result) {

              // Get the poem.
              _t.Poem.findById(poem.id, function(err, poem) {

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
