/*
 * Unit tests for application startup.
 */

var _t = require('../../dependencies.js');

describe('Init', function() {

  var app, config, io, user, running,
    notRunning, vote1, vote2, vote3;

  beforeEach(function(done) {

    // Mock app.
    app = {
      set: _t.sinon.spy()
    };

    // Mock config.
    global.config = {
      sliceInterval: 300,
      visibleWords: 100
    };

    // Mock io.
    io = {};

    // Create user.
    user = new _t.User({
      username: 'david',
      password: 'password',
      email: 'david@test.org'
    });

    // Create running poem.
    running = new _t.Poem({
      user: user.id,
      started: true,
      running: true,
      complete: false,
      roundLengthValue: 10,
      roundLengthUnit: 'seconds',
      sliceInterval: 300,
      minSubmissions: 5,
      submissionVal: 100,
      decayHalflife: 20,
      seedCapital: 1000,
      visibleWords: 500
    });

    // Create not running poem.
    notRunning = new _t.Poem({
      user: user.id,
      started: true,
      running: false,
      complete: false,
      roundLengthValue: 10,
      roundLengthUnit: 'seconds',
      sliceInterval: 300,
      minSubmissions: 5,
      submissionVal: 100,
      decayHalflife: 20,
      seedCapital: 1000,
      visibleWords: 500
    });

    // Create rounds.
    running.newRound();
    notRunning.newRound();

    // _t.Vote 1.
    var vote1 = new _t.Vote({
      round: running.round.id,
      word: 'word1',
      quantity: 100
    });

    // _t.Vote 2.
    var vote2 = new _t.Vote({
      round: running.round.id,
      word: 'word2',
      quantity: 100
    });

    // _t.Vote 3.
    var vote3 = new _t.Vote({
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
      _t.init(app, io, function() {
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
      _t.User,
      _t.Poem,
      _t.Vote
    ], _t.helpers.remove, function(err, models) {
      done();
    });

  });

  it('should start running poems', function() {

    // Check for round registraton.
    _t.assert.exist(global.Oversoul.votes[running.round.id]);

    // Check for vote registrations.
    global.Oversoul.votes[running.round.id].should.have.keys('word1', 'word2');
    global.Oversoul.votes[running.round.id]['word1'].length.should.eql(1);
    global.Oversoul.votes[running.round.id]['word2'].length.should.eql(1);

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
