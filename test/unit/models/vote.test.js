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

// User model.
require('../../../app/models/user');
var User = mongoose.model('User');

// Poem model.
require('../../../app/models/poem');
var Poem = mongoose.model('Poem');

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
 * ----------------------
 * Vote model unit tests.
 * ----------------------
 */


describe('Vote', function() {

  var user, poem, round, word, vote;

  beforeEach(function(done) {

    // Create user.
    user = new User({
      username:   'david',
      password:   'password',
      email:      'david@test.com',
      active:     true
    });

    // Create poem.
    poem = new Poem({
      slug: 'test-poem',
      user: user.id,
      roundLength : 10000,
      sliceInterval : 3,
      minSubmissions : 5,
      submissionVal : 100,
      decayLifetime : 50,
      seedCapital : 1000,
      visibleWords : 500
    });

    // Create round.
    round = new Round({
      poem: poem.id
    });

    // Create word.
    word = new Word({
      round: round.id,
      word: 'word'
    });

    // Create vote.
    vote = new Vote({
      word: word.id,
      quantity: 100
    });

    // Save worker.
    var save = function(document, callback) {
      document.save(function(err) {
        callback(null, document);
      });
    };

    // Save.
    async.map([
      user,
      poem,
      round,
      word,
      vote
    ], save, function(err, documents) {
      done();
    });

  });

  // Clear users and poems.
  afterEach(function(done) {

    // Truncate worker.
    var remove = function(model, callback) {
      model.collection.remove(function(err) {
        callback(err, model);
      });
    };

    // Truncate.
    async.map([
      User,
      Poem,
      Round,
      Word,
      Vote
    ], remove, function(err, models) {
      done();
    });

  });

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create vote, override defaults.
      var vote = new Vote();

      // Save.
      vote.save(function(err) {

        // Check for errors.
        err.errors.word.type.should.eql('required');
        err.errors.quantity.type.should.eql('required');

        // Check for 1 documents.
        Vote.count({}, function(err, count) {
          count.should.eql(1);
          done();
        });

      });

    });

  });

  describe('virtual fields', function() {

    describe('id', function() {

      it('should have a virtual field for "id"', function() {
        vote.id.should.be.ok;
      });

      it('should be a string', function() {
        vote.id.should.be.a('string');
      });

    });

  });

});