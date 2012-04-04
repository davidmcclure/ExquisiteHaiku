/*
 * Unit tests for round model.
 */

// Module dependencies.
var vows = require('mocha');
var should = require('should');
var async = require('async');
var assert = require('assert');
var sinon = require('sinon');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../db-connect');

// Round model.
require('../../../app/models/round');
var Round = mongoose.model('Round');

// Vote model.
require('../../../app/models/vote');
var Vote = mongoose.model('Vote');


/*
 * -----------------------
 * Round model unit tests.
 * -----------------------
 */


describe('Round', function() {

  var user, poem, round;

  beforeEach(function() {

    // Create round.
    round = new Round();

  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create round, override defaults.
      var round = new Round();
      round.started = null;

      // Save.
      round.save(function(err) {

        // Check for errors.
        err.errors.started.type.should.eql('required');

        // Check for 0 documents.
        Round.count({}, function(err, count) {
          count.should.eql(0);
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
        should.exist(round.id);
      });

      it('should be a string', function() {
        round.id.should.be.a('string');
      });

    });

  });

  describe('methods', function() {

    describe('score', function() {

      beforeEach(function(done) {

        var vote1, vote2, vote3, vote4, vote5, vote6;

        // 100 vote on word1.
        vote1 = new Vote({
          round: round.id,
          word: 'word1',
          quantity: 100
        });

        // 100 vote on word1.
        vote2 = new Vote({
          round: round.id,
          word: 'word1',
          quantity: 100
        });

        // 200 vote on word2.
        vote3 = new Vote({
          round: round.id,
          word: 'word2',
          quantity: 200
        })

        // 200 vote on word2.
        vote4 = new Vote({
          round: round.id,
          word: 'word2',
          quantity: 200
        });;

        // 300 vote on word3.
        vote5 = new Vote({
          round: round.id,
          word: 'word3',
          quantity: 300
        });

        // 300 vote on word3.
        vote6 = new Vote({
          round: round.id,
          word: 'word3',
          quantity: 300
        });

        // Save worker.
        var save = function(document, callback) {
          document.save(function(err) {
            callback(null, document);
          });
        };

        // Save.
        async.map([
          vote1, vote2, vote3, vote4, vote5, vote6
        ], save, function(err, documents) {
          done();
        });

      });

      // Clear votes.
      afterEach(function(done) {
        Vote.collection.remove(function(err) {
          done();
        });
      });

      it('should return an array of [[rank], [churn]]', function() {

        // Call at now+60s with 60s mean decay lifetime.
        var stacks = round.score(
          Date.now() + 60000, 60000, 2
        );

        // Check rank.
        stacks.rank[0][0].should.eql('word3');
        stacks.rank[1][0].should.eql('word2');
        should.not.exist(stacks.rank[2]);

        // Check churn.
        stacks.churn[0][0].should.eql('word3');
        stacks.churn[1][0].should.eql('word2');
        should.not.exist(stacks.churn[2]);

      });

    });

  });

});
