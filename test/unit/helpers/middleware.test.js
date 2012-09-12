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

  describe('getUser', function() {

    var user;

    beforeEach(function(done) {

      // Create user.
      user = new User({
        username: 'david',
        password: 'password',
        email: 'david@test.org'
      });

      // Save.
      user.save(function(err) {
        done();
      });

    });

    it('should set req.user when session exists', function(done) {

      // Set user id.
      req.session.user_id = user.id;

      // Call getUser.
      auth.getUser(req, res, function() {
        req.user.should.not.be.false;
        req.user.id.should.eql(user.id);
        done();
      });

    });

    it('should set req.user = false when session does not exist', function(done) {

      // Call getUser with no session.
      auth.getUser(req, res, function() {
        req.user.should.be.false;
        done();
      });

    });

    it('should set req.user = false for non-existent user', function(done) {

      // Set non-existent user id.
      req.session.user_id = 'invalid';

      // Call getUser.
      auth.getUser(req, res, function() {
        req.user.should.be.false;
        done();
      });

    });

  });

  describe('isUser', function() {

    it('should redirect when there is no session', function(done) {

      // Spy on res.
      res.redirect = sinon.spy();

      // Call isUser().
      auth.isUser(req, { redirect: function(route) {
        route.should.eql('/admin/login');
        done();
      }}, next);

    });

    it('should redirect a non-existent user', function(done) {

      // Set non-existent id.
      req.session.user_id = 'invalid';

      // Call isUser.
      auth.isUser(req, { redirect: function(route) {
        route.should.eql('/admin/login');
        done();
      }}, next);

    });

    it('should set req.user when user exists', function(done) {

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
        auth.isUser(req, res, function() {
          req.user.should.be.ok;
          req.user.id.should.eql(user.id);
          done();
        });

      });

    });

  });

  describe('noUser', function() {

    it('should redirect when user session exists', function(done) {

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
        auth.noUser(req, { redirect: function(route) {
          route.should.eql('/admin');
          done();
        }}, next);

      });

    });

    it('should call next() if no session', function(done) {

      // Call noUser.
      auth.noUser(req, res, function() {
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
        user: user.id,
        roundLengthValue: 10,
        roundLengthUnit: 'seconds',
        sliceInterval: 300,
        minSubmissions: 5,
        submissionVal: 100,
        decayLifetime: 50,
        seedCapital: 1000,
        visibleWords: 500
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

      // Set slug.
      req.params = { hash: poem.hash };

      // Call getPoem, check for next() and poem.
      auth.getPoem(req, res, function() {
        req.poem.id.should.eql(poem.id);
        done();
      });

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
        user: user1.id,
        roundLength: 10000,
        sliceInterval: 300,
        minSubmissions: 5,
        submissionVal: 100,
        decayLifetime: 50,
        seedCapital: 1000,
        visibleWords: 500
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

      // Set poem and user.
      req.poem = poem;
      req.user = user2;

      // Call ownsPoem, check for redirect.
      auth.ownsPoem(req, { redirect: function(route) {
        route.should.eql('/admin');
        done();
      }}, next);

    });

    it('should call next() when the poem is unstarted', function(done) {

      // Set poem and user.
      req.poem = poem;
      req.user = user1;

      // Call ownsPoem, check for redirect.
      auth.ownsPoem(req, res, function() {
        done();
      });

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
        user: user.id,
        roundLength: 10000,
        sliceInterval: 300,
        minSubmissions: 5,
        submissionVal: 100,
        decayLifetime: 50,
        seedCapital: 1000,
        visibleWords: 500
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

      // Set poem started.
      poem.started = true;

      // Save.
      poem.save(function(err) {

        // Set poem.
        req.poem = poem;

        // Call unstartedPoem, check for redirect.
        auth.unstartedPoem(req, { redirect: function(route) {
          route.should.eql('/admin');
          done();
        }}, next);

      });

    });

    it('should call next() when the poem is unstarted', function(done) {

      // Set poem unstarted.
      poem.started = false;

      // Save.
      poem.save(function(err) {

        // Set poem.
        req.poem = poem;

        // Call unstartedPoem, check for redirect.
        auth.unstartedPoem(req, res, function() {
          done();
        });

      });

    });

  });

});
