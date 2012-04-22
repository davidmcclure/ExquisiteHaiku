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
      roundLength : 20,
      sliceInterval : 10,
      minSubmissions : 5,
      submissionVal : 100,
      decayLifetime : 50,
      seedCapital : 1000,
      visibleWords : 3
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

      done();

    });

  });

});
