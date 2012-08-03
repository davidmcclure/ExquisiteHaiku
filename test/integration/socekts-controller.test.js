/*
 * Integration tests for sockets controller.
 */

// Module dependencies.
var vows = require('mocha');
var should = require('should');
var assert = require('assert');
var Browser = require('zombie');
var helpers = require('../helpers');
var io = require('socket.io-client');

// Bootstrap the application.
process.env.NODE_ENV = 'testing';
var server = require('../../app');

// Models.
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');

/*
 * -------------------------------------
 * Sockets controller integration tests.
 * -------------------------------------
 */


describe('Sockets Controller', function() {

  var r = 'http://localhost:3000';
  var user, poem, client;

  beforeEach(function(done) {

    // Create user.
    user = new User({
      username: 'david',
      password: 'password',
      email: 'david@test.org'
    });

    // Create poem.
    poem = new Poem({
      user: user.id,
      roundLength : 10000,
      sliceInterval : 3,
      minSubmissions : 5,
      submissionVal : 100,
      decayLifetime : 50,
      seedCapital : 1000,
      visibleWords : 500
    });

    // Connect socket.
    client = io.connect(r, {});

    // Save.
    user.save(function(err) {
      poem.save(function(err) {
        done();
      });
    });

  });

  describe('join', function() {

    it('should set the poem id');

  });

  describe('validate', function() {

    it('should call with false for invalid word');
    it('should call with false when word does not fit');
    it('should call with true when word fits');

  });

  describe('submit', function() {

    it('should apply the starting votes');

  });

  describe('vote', function() {

    it('should apply the vote');

  });

});
