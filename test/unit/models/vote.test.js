/*
 * Unit tests for vote model.
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

// Round.
require('../../../app/models/round');
var Round = mongoose.model('Round');

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

describe('Vote', function() {

  var round, vote;

  beforeEach(function() {

    // Create round.
    round = new Round();

    // Create vote.
    vote = new Vote({
      round: round.id,
      word: 'word',
      quantity: 100
    });

  });

  afterEach(function(done) {

    // Clear rounds and votes.
    async.map([
      Round,
      Vote
    ], helpers.remove, function(err, models) {
      done();
    });

  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create vote, override defaults.
      var vote = new Vote();
      vote.applied = null;

      // Save.
      vote.save(function(err) {

        // Check for errors.
        err.errors.round.type.should.eql('required');
        err.errors.applied.type.should.eql('required');
        err.errors.word.type.should.eql('required');
        err.errors.quantity.type.should.eql('required');

        // Check for 0 documents.
        Vote.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

  });

  describe('methods', function() {

    describe('register', function() {

      // Register round.
      beforeEach(function() {
        global.Oversoul.votes[vote.round] = {};
      });

      describe('when the word tracker exists', function() {

        // Register word tracker.
        beforeEach(function() {
          global.Oversoul.votes[vote.round][vote.word] = [];
        });

        it('should push the new vote', function() {

          // Register.
          vote.register();

          // Check for vote.
          var memoryVote = global.Oversoul.votes[vote.round][vote.word][0];
          memoryVote[0].should.eql(100);

        });

      });

      describe('when the word tracker does not exist', function() {

        it('should create the id key and push new vote', function() {

          // Register.
          vote.register();

          // Check for vote.
          var memoryVote = global.Oversoul.votes[vote.round][vote.word][0];
          memoryVote[0].should.eql(100);

        });

      });

    });

  });

  describe('virtual fields', function() {

    describe('id', function() {

      it('should have a virtual field for "id"', function() {
        assert.exist(round.id);
      });

      it('should be a string', function() {
        round.id.should.be.a('string');
      });

    });

  });

});
