
/**
 * Unit tests for application startup.
 */

var should = require('should');
var _t = require('../../dependencies.js');
var init = require('../../../config/init');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');
var Vote = mongoose.model('Vote');


describe('Init', function() {

  var app, config, io, user, running,
    notRunning, vote1, vote2, vote3;

  beforeEach(function(done) {

    // Mock app.
    app = {
      set: _t.sinon.spy()
    };

    // Mock config.
    global.config.sliceInterval = 300;
    global.config.visibleWords = 100;

    // Mock io.
    io = {};

    // Create user.
    user = new User({
      username: 'david',
      password: 'password',
      email: 'david@test.org'
    });

    // Create running poem.
    running = new Poem({
      user: user.id,
      started: true,
      running: true,
      complete: false,
      roundLengthValue: 10,
      roundLengthUnit: 'seconds',
      sliceInterval: 300,
      submissionVal: 100,
      decayHalflife: 20,
      seedCapital: 1000,
      visibleWords: 500
    });

    // Create not running poem.
    notRunning = new Poem({
      user: user.id,
      started: true,
      running: false,
      complete: false,
      roundLengthValue: 10,
      roundLengthUnit: 'seconds',
      sliceInterval: 300,
      submissionVal: 100,
      decayHalflife: 20,
      seedCapital: 1000,
      visibleWords: 500
    });

    // Create rounds.
    running.newRound();
    notRunning.newRound();

    // Vote 1.
    var vote1 = new Vote({
      round: running.round.id,
      word: 'word1',
      quantity: 100
    });

    // Vote 2.
    var vote2 = new Vote({
      round: running.round.id,
      word: 'word2',
      quantity: 100
    });

    // Vote 3.
    var vote3 = new Vote({
      round: notRunning.round.id,
      word: 'word3',
      quantity: 100
    });

    // Save.
    _t.async.map([
      user,
      running,
      notRunning,
      vote1,
      vote2,
      vote3
    ], _t.helpers.save, function(err, documents) {

      // Run init.
      init(app, io, function() {
        done();
      });

    });

  });

  // Clear users and poems.
  afterEach(function(done) {

    // Clear the intervals.
    _t._.each(global.Oversoul.timers, function(int, id) {
      clearInterval(int);
    });

    // Clear votes and timers.
    global.Oversoul = { timers: {}, votes: {} };

    // Truncate.
    _t.async.map([
      User,
      Poem,
      Vote
    ], _t.helpers.remove, function(err, models) {
      done();
    });

  });

  it('should start running poems', function() {

    // Check for round registraton.
    should.exist(global.Oversoul.votes[running.round.id]);

    // Check for vote registrations.
    global.Oversoul.votes[running.round.id].should.have.keys('word1', 'word2');
    global.Oversoul.votes[running.round.id]['word1'].length.should.eql(1);
    global.Oversoul.votes[running.round.id]['word2'].length.should.eql(1);

    // Check for timer.
    global.Oversoul.timers[running.id].should.be.ok;

  });

  it('should not poems that are not running', function() {

    // Check for no round registraton.
    global.Oversoul.votes.should.not.have.keys(notRunning.round.id);

    // Check for not timer.
    global.Oversoul.timers.should.not.have.keys(notRunning.id);

  });

});
