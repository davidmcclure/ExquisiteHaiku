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

// Word model.
require('../../../app/models/word');
var Word = mongoose.model('Word');

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

  // Clear users, poems, and rounds.
  after(function(done) {

    // Truncate worker.
    var remove = function(model, callback) {
      model.collection.remove(function(err) {
        callback(err, model);
      });
    };

    // Truncate.
    Word.collection.remove(function(err) {
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

        // Create word1.
        var word1 = new Word({
          round: round.id,
          word: 'word1'
        });

        // Create word2.
        var word2 = new Word({
          round: round.id,
          word: 'word2'
        });

        // Create word3.
        var word3 = new Word({
          round: round.id,
          word: 'word3'
        });

        // 100 vote on word1.
        word1.votes.push(new Vote({
          quantity: 100
        }));

        // 100 vote on word1.
        word1.votes.push(new Vote({
          quantity: 100
        }));

        // 200 vote on word2.
        word2.votes.push(new Vote({
          quantity: 200
        }));

        // 200 vote on word2.
        word2.votes.push(new Vote({
          quantity: 200
        }));

        // 300 vote on word3.
        word3.votes.push(new Vote({
          quantity: 300
        }));

        // 300 vote on word3.
        word3.votes.push(new Vote({
          quantity: 300
        }));

        // Save.
        word1.save(function(err) {
          word2.save(function(err) {
            word3.save(function(err) {
              done();
            });
          });
        });

      });

      it('should return an array of [[rank], [churn]]', function(done) {

        // Call at now+60s with 60s mean decay lifetime.
        round.score(Date.now() + 60000, 60000, 2, function(stacks) {
          stacks[0][0][0].should.eql('word3');
          stacks[0][1][0].should.eql('word2');
          should.not.exist(stacks[0][2]);
          stacks[1][0][0].should.eql('word3');
          stacks[1][1][0].should.eql('word2');
          should.not.exist(stacks[1][2]);
          done();
        });

      });

    });

  });

});
