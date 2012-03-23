/*
 * Scoring routine performance tests.
 */

// Module dependencies.
var async = require('async');

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
 * ------------------------------
 * Slicer performance benchmarks.
 * ------------------------------
 */


describe('Scoring Benchmarks', function() {

  var user, poem;

  after(function() {
    console.log('\n');
  });

  before(function(done) {

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

  // Clear documents.
  afterEach(function(done) {

    // Truncate worker.
    var remove = function(model, callback) {
      model.collection.remove(function(err) {
        callback(err, model);
      });
    };

    // Truncate.
    async.map([
      Poem,
      Round,
      Word,
      Vote
    ], remove, function(err, models) {
      done();
    });

  });

  describe('100 words', function() {

    it('10 votes/word');
    it('50 votes/word');
    it('100 votes/word');

  });

  describe('500 words', function() {

    it('10 votes/word');
    it('50 votes/word');
    it('100 votes/word');

  });

  describe('1000 words', function() {

    it('10 votes/word');
    it('50 votes/word');
    it('100 votes/word');

  });

});
