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

// Bootstrap the application.
process.env.NODE_ENV = 'testing';
var server = require('../../app');

// Models.
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');
var Round = mongoose.model('Round');
var Vote = mongoose.model('Vote');

/*
 * -------------------------------------
 * Sockets controller integration tests.
 * -------------------------------------
 */


describe('Sockets Controller', function() {

  var r = 'http://localhost:3000';
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
    client1 = io.connect(r, options);
    client1.emit('join', poem1.id);

    // Connect client2.
    client2 = io.connect(r, options);
    client2.emit('join', poem1.id);

    // Connect client3.
    client3 = io.connect(r, options);
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

  describe('join', function() {

    it('should join the socket', function(done) {
      client1.on('joined', function() {
        client1.disconnect();
        done();
      });
    });

  });

  describe('validate', function() {

    it('should call with false for invalid word', function(done) {

      // Catch join.
      client1.on('joined', function() {

        // Trigger 'validate' with non-word.
        client1.emit('validate', poem1.id, 'invalidword', function(result) {
          result.should.be.false;
          client1.disconnect();
          done();
        });

      });

    });

    it('should call with false when word does not fit', function(done) {

      // Catch join.
      client1.on('joined', function() {

        // Trigger 'validate' with word with too many syllables.
        client1.emit('validate', poem1.id, 'excessive', function(result) {
          result.should.be.false;
          client1.disconnect();
          done();
        });

      });

    });

    it('should call with true when word fits', function(done) {

      // Catch join.
      client1.on('joined', function() {

        // Trigger 'validate' with valid word.
        client1.emit('validate', poem1.id, 'profits', function(result) {
          result.should.be.true;
          client1.disconnect();
          done();
        });

      });

    });

  });

  describe('submit', function() {

    it('should apply the starting votes');
    it('should echo each of the starting votes');

  });

  describe('vote', function() {

    it('should apply the vote');
    it('should echo the vote to players in the same poem');
    it('should not echo the vote to players in other poems');

  });

});
