/*
 * Unit tests for word model.
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

// Word model.
require('../../../app/models/word');
var Word = mongoose.model('Word');

// Vote model.
require('../../../app/models/vote');
var Vote = mongoose.model('Vote');


/*
 * ----------------------
 * Word model unit tests.
 * ----------------------
 */


describe('Word', function() {

  var user, poem, round, word;

  beforeEach(function() {

    // Create word.
    word = new Word({
      word: 'word'
    });

  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create word, override defaults.
      var word = new Word();
      word.word = null;

      // Save.
      word.save(function(err) {

        // Check for errors.
        err.errors.round.type.should.eql('required');
        err.errors.word.type.should.eql('required');

        // Check for 1 documents.
        Word.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

  });

  describe('virtual fields', function() {

    describe('id', function() {

      it('should have a virtual field for "id"', function() {
        should.exist(word.id);
      });

      it('should be a string', function() {
        word.id.should.be.a('string');
      });

    });

  });

  describe('methods', function() {

    describe('score', function() {

      beforeEach(function() {

        // Create vote1.
        word.votes.push(new Vote({
          quantity: 100
        }));

        // Create vote2.
        word.votes.push(new Vote({
          quantity: 100
        }));

      });

      it('should return an array of [rank, churn]', function() {

        // Call at now+60s with 60s mean decay lifetime.
        word.score(
          Date.now() + 600000, 60000
        ).should.eql([12000, 0]);

      });

    });

  });

});
