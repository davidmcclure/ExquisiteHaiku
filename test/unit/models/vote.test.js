/*
 * Unit tests for vote model.
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

// Vote model.
require('../../../app/models/vote');
var Vote = mongoose.model('Vote');

/*
 * ----------------------
 * Vote model unit tests.
 * ----------------------
 */


describe('Vote', function() {

  var user, poem, round, word, vote;

  beforeEach(function() {

    // Create vote.
    vote = new Vote({
      quantity: 100
    });

  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create vote, override defaults.
      var vote = new Vote();
      vote.applied = null

      // Save.
      vote.save(function(err) {

        // Check for errors.
        err.errors.quantity.type.should.eql('required');
        err.errors.applied.type.should.eql('required');

        // Check for 0 documents.
        Vote.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

  });

  describe('field defaults', function() {

    it('should set "applied" to the current date by default', function() {
      vote.applied.should.be.ok;
    });

  });

  describe('virtual fields', function() {

    describe('id', function() {

      it('should have a virtual field for "id"', function() {
        should.exist(vote.id);
      });

      it('should be a string', function() {
        vote.id.should.be.a('string');
      });

    });

  });

  describe('methods', function() {

    describe('score', function() {

      it('should return an array of [rank, churn]', function() {

        // Call at now+60s with 60s mean decay lifetime.
        vote.score(vote.applied.valueOf() + 60000, 60000).
          should.eql([3793, 37]);

      });

    });

  });

});
