/*
 * Unit tests for route middleware methods.
 */

// Modules
// -------
var mocha = require('mocha');
var should = require('should');
var assert = require('assert');
var async = require('async');
var sinon = require('sinon');
var config = require('yaml-config');
var mongoose = require('mongoose');
var helpers = require('../../helpers');
var _ = require('underscore');


// Models
// ------

// User.
require('../../../app/models/user');
var User = mongoose.model('User');

// Poem.
require('../../../app/models/poem');
var Poem = mongoose.model('Poem');


// Helpers
// -------

// Auth.
var auth = require('../../../helpers/middleware');


// Config
// ------

var root = config.readConfig('test/config.yaml').root;


// Run
// ---

process.env.NODE_ENV = 'testing';
var server = require('../../../app');


// Specs
// -----

describe('Route Middleware', function() {

  var req, res, next;

  // Reset req/res mocks.
  beforeEach(function() {
    req = { session: {} };
    res = {};
  });

  // Clear users.
  afterEach(function(done) {

    // Truncate.
    async.map([
      User,
      Poem
    ], helpers.remove, function(err, models) {
      done();
    });

  });

  describe('isUser', function() {

    it('should redirect when there is no session', function() {

      // Spy on res.
      res.redirect = sinon.spy();

      auth.isUser(req, res, next);
      sinon.assert.calledWith(res.redirect, '/admin/login');

    });

    it('should redirect a non-existent user', function(done) {

      // Spy on res.
      res.redirect = sinon.spy(function() {
        sinon.assert.calledWith(res.redirect, '/admin/login');
        done();
      });

      // Spy on next.
      next = sinon.spy(function() {
        sinon.assert.calledWith(res.redirect, '/admin/login');
        done();
      });

      // Create user.
      var user = new User({
        username: 'david',
        password: 'password',
        email: 'david@test.org'
      });

      // Save.
      user.save(function(err) {

        // Set user id.
        req.session.user_id = user.id;

        // Delete the user.
        user.remove(function(err) {

          // Call isUser.
          auth.isUser(req, res, next);

        });

      });

    });

    it('should call next() for user', function(done) {

      // Spy on res.
      res.redirect = sinon.spy(function() {
        sinon.assert.called(next);
        done();
      });

      // Spy on next.
      next = sinon.spy(function() {
        sinon.assert.called(next);
        done();
      });

      // Create user.
      var user = new User({
        username: 'david',
        password: 'password',
        email: 'david@test.org'
      });

      // Save.
      user.save(function(err) {

        // Set user id.
        req.session.user_id = user.id;

        // Call isUser, check for next().
        auth.isUser(req, res, next);

      });

    });

    it('should pass user document into controller action', function(done) {

      // Create user.
      var user = new User({
        username: 'david',
        password: 'password',
        email: 'david@test.org'
      });

      // Save.
      user.save(function(err) {

        // Spy on res.
        res.redirect = sinon.spy(function() {
          req.user.should.be.ok;
          req.user.id.should.eql(user.id);
          done();
        });

        // Spy on next.
        next = sinon.spy(function() {
          req.user.should.be.ok;
          req.user.id.should.eql(user.id);
          done();
        });

        // Set user id.
        req.session.user_id = user.id;

        // Call isUser, check for next().
        auth.isUser(req, res, next);

      });

    });

  });

  describe('noUser', function() {

    it('should redirect when there is a user session', function(done) {

      // Spy on res.
      res.redirect = sinon.spy();

      // Create user.
      var user = new User({
        username: 'david',
        password: 'password',
        email: 'david@test.org'
      });

      // Save.
      user.save(function(err) {

        // Set user id.
        req.session.user_id = user.id;

        // Call noUser, check for res.redirect().
        auth.noUser(req, res, next);
        sinon.assert.calledWith(res.redirect, '/admin');
        done();

      });

    });

    it('should call next() when the user is not a user session', function(done) {

      // Spy on next.
      next = sinon.spy();

      // Create user.
      var user = new User({
        username: 'david',
        password: 'password',
        email: 'david@test.org'
      });

      // Save.
      user.save(function(err) {

        // Call noUser, check for next().
        auth.noUser(req, res, next);
        sinon.assert.called(next);
        done();

      });

    });

  });

  describe('getPoem', function() {

    var user, poem;

    beforeEach(function(done) {

      // Create user.
      user = new User({
        username: 'david',
        password: 'password',
        email: 'david@test.org'
      });

      // Create poem.
      poem = new Poem({
        user:             user.id,
        roundLength :     10000,
        sliceInterval :   3,
        minSubmissions :  5,
        submissionVal :   100,
        decayLifetime :   50,
        seedCapital :     1000,
        visibleWords :    500
      });

      // Save.
      async.map([
        user,
        poem
      ], helpers.save, function(err, documents) {
        done();
      });

    });

    it('should load the poem and call next()', function(done) {

      // Spy on next.
      next = sinon.spy(function() {
        sinon.assert.called(next);
        req.poem.id.should.eql(poem.id);
        done();
      });

      // Set slug.
      req.params = { hash: poem.hash };

      // Call getPoem, check for next() and poem.
      auth.getPoem(req, res, next);

    });

  });

  describe('ownsPoem', function() {

    var user1, user2, poem;

    beforeEach(function(done) {

      // Create user1.
      user1 = new User({
        username: 'david',
        password: 'password',
        email: 'david@test.org'
      });

      // Create user2.
      user2 = new User({
        username: 'kara',
        password: 'password',
        email: 'kara@test.org'
      });

      // Create poem1.
      poem = new Poem({
        user:             user1.id,
        roundLength :     10000,
        sliceInterval :   3,
        minSubmissions :  5,
        submissionVal :   100,
        decayLifetime :   50,
        seedCapital :     1000,
        visibleWords :    500
      });

      // Save.
      async.map([
        user1,
        user2,
        poem
      ], helpers.save, function(err, documents) {
        done();
      });

    });

    it('should redirect when the user does not own the poem', function(done) {

      // Spy on res.
      res.redirect = sinon.spy();

      // Set poem and user.
      req.poem = poem;
      req.user = user2;

      // Call ownsPoem, check for redirect.
      auth.ownsPoem(req, res, next);
      sinon.assert.calledWith(res.redirect, '/admin');
      done();

    });

    it('should call next() when the poem is unstarted', function(done) {

      // Spy on next.
      next = sinon.spy();

      // Set poem and user.
      req.poem = poem;
      req.user = user1;

      // Call ownsPoem, check for redirect.
      auth.ownsPoem(req, res, next);
      sinon.assert.called(next);
      done();

    });

  });

  describe('unstartedPoem', function() {

    var user, poem;

    beforeEach(function(done) {

      // Create user.
      user = new User({
        username: 'david',
        password: 'password',
        email: 'david@test.org'
      });

      // Create poem.
      poem = new Poem({
        user:             user.id,
        roundLength :     10000,
        sliceInterval :   3,
        minSubmissions :  5,
        submissionVal :   100,
        decayLifetime :   50,
        seedCapital :     1000,
        visibleWords :    500
      });

      // Save.
      async.map([
        user,
        poem
      ], helpers.save, function(err, documents) {
        done();
      });

    });

    it('should redirect when the poem has been started', function(done) {

      // Spy on res.
      res.redirect = sinon.spy();

      // Set poem started.
      poem.started = true;

      // Save.
      poem.save(function(err) {

        // Set poem.
        req.poem = poem;

        // Call unstartedPoem, check for redirect.
        auth.unstartedPoem(req, res, next);
        sinon.assert.calledWith(res.redirect, '/admin');
        done();

      });

    });

    it('should call next() when the poem is unstarted', function(done) {

      // Spy on next.
      next = sinon.spy();

      // Set poem unstarted.
      poem.started = false;

      // Save.
      poem.save(function(err) {

        // Set poem.
        req.poem = poem;

        // Call unstartedPoem, check for redirect.
        auth.unstartedPoem(req, res, next);
        sinon.assert.called(next);
        done();

      });

    });

  });

});
