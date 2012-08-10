/*
 * Unit tests for application startup.
 */

// Module dependencies.
var mocha = require('mocha');
var should = require('should');
var async = require('async');
var assert = require('assert');
var sinon = require('sinon');
var helpers = require('../../helpers');
var _ = require('underscore');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../../db-connect');

// Models.
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');
var Vote = mongoose.model('Vote');

// Init module.
var init = require('../../../init');

/*
 * ----------------
 * Init unit tests.
 * ----------------
 */


describe('Init', function() {

  var app, config, io;

  beforeEach(function() {

    // Mock app.
    app = {
      set: function(key, val) {}
    };

    // Mock config.
    config = {
      sliceInterval: 300,
      visibleWords: 100
    };

    // Mock io.
    io = {};

  });

  // Clear users and poems.
  afterEach(function(done) {

    // Clear the intervals.
    _.each(global.Oversoul.timers, function(int, id) {
      clearInterval(int);
    });

    // Clear votes and timers.
    global.Oversoul = { timers: {}, votes: {} };

    // Truncate.
    async.map([
      User,
      Poem,
      Vote
    ], helpers.remove, function(err, models) {
      done();
    });

  });

  describe('run', function() {

    beforeEach(function() {
      app.set = sinon.spy();
      init.startPoems = sinon.spy();
      init.run(app, config, io);
    });

    it('should shell out "votes" and "timers" objects', function() {
      global.Oversoul.should.have.keys('votes', 'timers');
    });

    it('should set configuration options', function() {
      sinon.assert.calledWith(app.set, 'sliceInterval', 300);  
      sinon.assert.calledWith(app.set, 'visibleWords', 100);  
    });

    it('should call startPoems()', function() {
      sinon.assert.calledWith(init.startPoems, io);
    });

  });

  describe('startPoems', function() {

    var user, running, notRunning, vote1, vote2;

    beforeEach(function(done) {

      // Create user.
      user = new User({
        username: 'david',
        password: 'password',
        email: 'david@test.org'
      });

      // Create running poem.
      running = new Poem({
        user:             user.id,
        started:          true,
        running:          true,
        complete:         false,
        roundLength :     500000,
        sliceInterval :   1000,
        minSubmissions :  5,
        submissionVal :   100,
        decayLifetime :   50000,
        seedCapital :     1000,
        visibleWords :    500
      });

      // Create not running poem.
      notRunning = new Poem({
        user:             user.id,
        started:          true,
        running:          false,
        complete:         false,
        roundLength :     500000,
        sliceInterval :   1000,
        minSubmissions :  5,
        submissionVal :   100,
        decayLifetime :   50000,
        seedCapital :     1000,
        visibleWords :    500
      });

      // Create rounds.
      running.newRound();
      notRunning.newRound();

      // Vote 1.
      var vote1 = new Vote({
        round: running.round.id,
        word: 'word',
        quantity: 100
      });

      // Vote 2.
      var vote2 = new Vote({
        round: notRunning.round.id,
        word: 'word',
        quantity: 100
      });

      // Save.
      async.map([
        user,
        running,
        notRunning,
        vote1,
        vote2
      ], helpers.save, function(err, documents) {
        
        // Clear out in-memory stores.
        global.Oversoul = { timers: {}, votes: {} };

        // Call startPoems.
        init.startPoems();
        done();

      });

    });

    it('should start running poems', function() {

      // Check for round registraton.
      global.Oversoul.votes.should.have.keys(running.round.id);

      // Check for vote registrations.
      global.Oversoul.votes[running.round.id].should.have.keys('word');
      global.Oversoul.votes[running.round.id]['word'][0].should.eql(100);

      // Check for timer.
      global.Oversoul.timers.should.have.keys(running.id);

    });

    it('should not poems that are not running', function() {

      // Check for no round registraton.
      global.Oversoul.votes.should.not.have.keys(notRunning.round.id);

      // Check for not timer.
      global.Oversoul.timers.should.not.have.keys(notRunning.id);

    });

  });

});
