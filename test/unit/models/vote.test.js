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

// Round model.
require('../../../app/models/round');
var Round = mongoose.model('Round');

// Vote model.
require('../../../app/models/vote');
var Vote = mongoose.model('Vote');


/*
 * ----------------------
 * Vote model unit tests.
 * ----------------------
 */


describe('Vote', function() {

  var round, vote;

  // Create round and vote.
  beforeEach(function() {
    round = new Round();
    vote = new Vote();
  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

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

});
