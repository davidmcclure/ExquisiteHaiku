/*
 * Integration tests for sockets controller.
 */

// Module dependencies.
var mocha = require('mocha');
var should = require('should');
var assert = require('assert');
var Browser = require('zombie');
var async = require('async');
var helpers = require('../helpers');
var sinon = require('sinon');
var io = require('socket.io-client');
var config = require('yaml-config');
var mongoose = require('mongoose');
var _ = require('underscore');

// User model.
require('../../app/models/user');
var User = mongoose.model('User');

// Poem model.
require('../../app/models/poem');
var Poem = mongoose.model('Poem');

// Round model.
require('../../app/models/round');
var Round = mongoose.model('Round');

// Vote model.
require('../../app/models/vote');
var Vote = mongoose.model('Vote');

// Load configuration.
var root = config.readConfig('test/config.yaml').root;

// Bootstrap the application.
process.env.NODE_ENV = 'testing';
var server = require('../../app');

/*
 * -------------------------------------
 * Sockets controller integration tests.
 * -------------------------------------
 */


describe('Sockets Controller', function() {

  var user, poem1, poem2, client1, client2, client3;

  beforeEach(function(done) {

    // Create user.
    user = new User({
      username: 'david',
      password: 'password',
      email: 'david@test.org'
    });

    // Create poem.
    poem1 = new Poem({
      user: user.id,
      roundLength : 10000,
      sliceInterval : 3,
      minSubmissions : 5,
      submissionVal : 100,
      decayLifetime : 50,
      seedCapital : 1000,
      visibleWords : 500,
      words: [['it', 'little']]
    });

    // Create poem.
    poem2 = new Poem({
      user: user.id,
      roundLength : 10000,
      sliceInterval : 3,
      minSubmissions : 5,
      submissionVal : 100,
      decayLifetime : 50,
      seedCapital : 1000,
      visibleWords : 500
    });

    var options = {
      transports: ['websocket'],
      'force new connection': true
    };

    // Connect client1.
    client1 = io.connect(root, options);
    client1.emit('join', poem1.id);

    // Connect client2.
    client2 = io.connect(root, options);
    client2.emit('join', poem1.id);

    // Connect client3.
    client3 = io.connect(root, options);
    client3.emit('join', poem2.id);

    // Create rounds on poems.
    poem1.newRound();
    poem2.newRound();

    // Save.
    async.map([
      user,
      poem1,
      poem2
    ], helpers.save, function(err, documents) {
      done();
    });

  });

  // Clear.
  afterEach(function(done) {

    // Empty votes tracker.
    global.Oversoul.votes = {};

    // Clear collections.
    async.map([
      User,
      Poem,
      Round,
      Vote
    ], helpers.remove, function(err, models) {
      done();
    });

  });

  // Close connection.
  after(function() {
    mongoose.connection.close();
  });

  describe('join', function() {

    it('should join the socket', function(done) {
      client1.on('join:complete', function() {
        done();
      });
    });

  });

  describe('validate', function() {

    it('should call with false for invalid word', function(done) {

      // Catch join.
      client1.on('join:complete', function() {

        // Trigger 'validate' with non-word.
        client1.emit('validate', poem1.id, 'invalidword', function(result) {
          result.should.be.false;
          done();
        });

      });

    });

    it('should call with false when word does not fit', function(done) {

      // Catch join.
      client1.on('join:complete', function() {

        // Trigger 'validate' with word with too many syllables.
        client1.emit('validate', poem1.id, 'excessive', function(result) {
          result.should.be.false;
          done();
        });

      });

    });

    it('should call with true when word fits', function(done) {

      // Catch join.
      client1.on('join:complete', function() {

        // Trigger 'validate' with valid word.
        client1.emit('validate', poem1.id, 'profits', function(result) {
          result.should.be.true;
          done();
        });

      });

    });

  });

  describe('submit', function() {

    var words = ['word1', 'word2', 'word3'];

    it('should apply the votes', function(done) {

      // Catch 'join'.
      client1.on('join:complete', function() {

        // Trigger 'submit'.
        client1.emit('submit', poem1.id, words);

        // Catch 'submit:complete'.
        client1.on('submit:complete', function() {

          // Check for votes.
          Vote.find({ round: poem1.round.id }, function(err, votes) {

            // Get words array.
            var words = _.map(votes, function(vote) {
              return vote.word;
            });

            // Check for words.
            words.length.should.eql(3);
            words.should.include('word1');
            words.should.include('word2');
            words.should.include('word3');

            // Check for in-memory vote registrations.
            global.Oversoul.votes[poem1.round.id]['word1'].length.should.eql(1);
            global.Oversoul.votes[poem1.round.id]['word2'].length.should.eql(1);
            global.Oversoul.votes[poem1.round.id]['word3'].length.should.eql(1);
            global.Oversoul.votes[poem1.round.id]['word1'][0][0].should.eql(100);
            global.Oversoul.votes[poem1.round.id]['word2'][0][0].should.eql(100);
            global.Oversoul.votes[poem1.round.id]['word3'][0][0].should.eql(100);
            done();

          });

        });

      });

    });

    it('should echo the votes', function(done) {

      // Spy on the 'vote' event callback.
      var voteCallback1 = sinon.spy();
      var voteCallback2 = sinon.spy();
      var voteCallback3 = sinon.spy();
      client1.on('vote', voteCallback1);
      client2.on('vote', voteCallback2);
      client3.on('vote', voteCallback3);

      // Catch 'join'.
      client1.on('join:complete', function() {

        // Trigger 'submit'.
        client1.emit('submit', poem1.id, words);

        // Catch 'submit:complete'.
        client1.on('submit:complete', function() {

          // Wait for echo callbacks to execute.
          setTimeout(function() {

            // Check client1 echoes.
            voteCallback1.callCount.should.eql(3);
            sinon.assert.calledWith(voteCallback1, 'word1', 100);
            sinon.assert.calledWith(voteCallback1, 'word2', 100);
            sinon.assert.calledWith(voteCallback1, 'word3', 100);

            // Check client2 echoes.
            voteCallback2.callCount.should.eql(3);
            sinon.assert.calledWith(voteCallback2, 'word1', 100);
            sinon.assert.calledWith(voteCallback2, 'word2', 100);
            sinon.assert.calledWith(voteCallback2, 'word3', 100);

            // Check client3 echoes.
            voteCallback3.callCount.should.eql(0);
            done();

          }, 100);

        });

      });

    });

  });

  describe('vote', function() {

    it('should apply the vote', function(done) {

      // Catch 'join'.
      client1.on('join:complete', function() {

        // Trigger 'vote'.
        client1.emit('vote', poem1.id, 'word', 100);

        // Catch 'vote:complete'.
        client1.on('vote:complete', function() {

          // Check for votes.
          Vote.find({ round: poem1.round.id }, function(err, votes) {

            // Check vote.
            votes.length.should.eql(1);
            votes[0].word.should.eql('word');
            votes[0].quantity.should.eql(100);

            // Check for in-memory vote registration.
            global.Oversoul.votes[poem1.round.id]['word'].length.should.eql(1);
            global.Oversoul.votes[poem1.round.id]['word'][0][0].should.eql(100);
            done();

          });

        });

      });

    });

    it('should echo the vote', function(done) {

      // Spy on the 'vote' event callback.
      var voteCallback1 = sinon.spy();
      var voteCallback2 = sinon.spy();
      var voteCallback3 = sinon.spy();
      client1.on('vote', voteCallback1);
      client2.on('vote', voteCallback2);
      client3.on('vote', voteCallback3);

      // Catch 'join'.
      client1.on('join:complete', function() {

        // Trigger 'vote'.
        client1.emit('vote', poem1.id, 'word', 100);

        // Catch 'vote:complete'.
        client1.on('vote:complete', function() {

          // Wait for echo callbacks to execute.
          setTimeout(function() {
            sinon.assert.calledWith(voteCallback1, 'word', 100);
            sinon.assert.calledWith(voteCallback2, 'word', 100);
            voteCallback3.notCalled.should.be.true;
            done();
          }, 100);

        });

      });

    });

  });

});