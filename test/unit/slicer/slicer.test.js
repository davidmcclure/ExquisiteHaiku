/*
 * Unit tests for slicer.
 */

// Module dependencies.
var vows = require('mocha');
var should = require('should');
var async = require('async');
var assert = require('assert');
var sinon = require('sinon');
var slicer = require('../../../lib/slicer');
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
 * ------------------
 * Slicer unit tests.
 * ------------------
 */


describe('Slicer', function() {

  var user, poem;

  before(function(done) {

    // Create user.
    user = new User({
      username: 'david',
      password: 'password'
    });

    // Create poem.
    poem = new Poem({
      slug: 'slug',
      user: user.id,
      roundLength : 50,
      sliceInterval : 10,
      minSubmissions : 5,
      submissionVal : 100,
      decayLifetime : 100,
      seedCapital : 1000,
      visibleWords : 2
    });

    // Create round.
    poem.newRound();

    // Save worker.
    var save = function(document, callback) {
      document.save(function(err) {
        callback(null, document);
      });
    };

    // Save.
    async.map([
      user,
      poem
    ], save, function(err, documents) {
      done();
    });

  });

  after(function(done) {

    // Clear the intervals.
    _.each(global.Oversoul.timers, function(int, id) {
      clearInterval(int);
    });

    // Clear the timer and vote hash.
    global.Oversoul.timers = {};
    global.Oversoul.votes = {};

    // Truncate worker.
    var remove = function(model, callback) {
      model.collection.remove(function(err) {
        callback(err, model);
      });
    };

    // Truncate.
    async.map([
      User,
      Poem
    ], remove, function(err, models) {
      done();
    });

  });

  describe('longitudinal slicing behavior', function() {

    it('should compute stacks and update words/round', function(done) {

      // At the start, 1 round, no words.
      poem.rounds.length.should.eql(1);
      poem.words.should.be.empty;

      // Capture round1 id.
      var round1 = poem.round.id;

      // Slice.
      slicer.integrator(poem.id, function(result) {

        // Empty stacks.
        result.stacks.rank.should.be.empty;
        result.stacks.churn.should.be.empty;

        // word1/100.
        global.Oversoul.votes[poem.round.id].push(
          new Vote({
            word: 'word1',
            quantity: 100,
            applied: Date.now()
          })
        );

        // Sleep 20ms.
        setTimeout(function() {

          // Slice.
          slicer.integrator(poem.id, function(result) {

            // Check length.
            result.stacks.rank.length.should.eql(1);
            result.stacks.churn.length.should.eql(1);

            // Check word order.
            result.stacks.rank[0][0].should.eql('word1');
            result.stacks.churn[0][0].should.eql('word1');

            // Check value ranges.
            result.stacks.rank[0][1].should.within(0,4);
            result.stacks.churn[0][1].should.within(75,85);

            // word1/100.
            global.Oversoul.votes[poem.round.id].push(
              new Vote({
                word: 'word1',
                quantity: 100,
                applied: Date.now()
              })
            );

            // word2/100.
            global.Oversoul.votes[poem.round.id].push(
              new Vote({
                word: 'word2',
                quantity: 100,
                applied: Date.now()
              })
            );

            // word3/100.
            global.Oversoul.votes[poem.round.id].push(
              new Vote({
                word: 'word3',
                quantity: 1,
                applied: Date.now()
              })
            );

            // Sleep 20ms.
            setTimeout(function() {

              // Slice.
              slicer.integrator(poem.id, function(result) {

                // Check length.
                result.stacks.rank.length.should.eql(2);
                result.stacks.churn.length.should.eql(2);

                // Check word order.
                result.stacks.rank[0][0].should.eql('word1');
                result.stacks.rank[1][0].should.eql('word2');
                result.stacks.churn[0][0].should.eql('word1');
                result.stacks.churn[1][0].should.eql('word2');

                // Check value ranges.
                result.stacks.rank[0][1].should.within(5,7);
                result.stacks.rank[1][1].should.within(0,4);
                result.stacks.churn[0][1].should.within(140,150);
                result.stacks.churn[1][1].should.within(75,85);

                // Sleep 20ms.
                setTimeout(function() {

                  // Slice.
                  slicer.integrator(poem.id, function(result) {

                    // Check for new round.
                    result.round.should.not.eql(round1);

                    // Check for empty stacks.
                    result.stacks.rank.should.eql({});
                    result.stacks.churn.should.eql({});
                    done();

                  }, function() {});

                }, 20);

              }, function() {});

            }, 20);

          }, function() {});

        }, 20);

      }, function() {});

    });

  });

});
