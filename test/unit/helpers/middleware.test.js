/*
 * Unit tests for route middleware methods.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  sinon = require('sinon'),
  async = require('async');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../db-connect');

// User model.
require('../../../app/models/user');
var User = mongoose.model('User');

// Middleware.
var auth = require('../../../helpers/middleware');


/*
 * ----------------------------
 * Route middleware unit tests.
 * ----------------------------
 */


describe('Route Middleware', function() {

  var req, res, next;

  // Reset req/res mocks.
  beforeEach(function() {
    req = { session: {} };
    res = {};
  });

  // Clear users.
  afterEach(function(done) {
    User.collection.remove(function(err) { done(); });
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

      // Create inactive user.
      var user = new User({
        username: 'david',
        email:    'david@spyder.com',
        password: 'password',
        active:   false
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

    it('should redirect an inactive user', function(done) {

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

      // Create inactive user.
      var user = new User({
        username: 'david',
        email:    'david@spyder.com',
        password: 'password',
        active:   false
      });

      // Save.
      user.save(function(err) {

        // Set user id.
        req.session.user_id = user.id;

        // Call isUser, check for res.redirect();
        auth.isUser(req, res, next);

      });

    });

    it('should call next() for an active user', function(done) {

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

      // Create inactive user.
      var user = new User({
        username: 'david',
        email:    'david@spyder.com',
        password: 'password',
        active:   true
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

      // Create inactive user.
      var user = new User({
        username: 'david',
        email:    'david@spyder.com',
        password: 'password',
        active:   true
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

  describe('isSuper', function() {

    it('should redirect when the user is not a super', function(done) {

      // Spy on res.
      res.redirect = sinon.spy();

      // Create non-super user.
      var user = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        active:     true,
        superUser:  false
      });

      // Save.
      user.save(function(err) {

        // Set user id.
        req.user = user;

        // Call isSuper, check for next().
        auth.isSuper(req, res, next);
        sinon.assert.calledWith(res.redirect, '/admin/login');
        done();

      });

    });

    it('should call next() when the user is a super', function(done) {

      // Spy on next.
      next = sinon.spy();

      // Create non-super user.
      var user = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        active:     true,
        superUser:  true
      });

      // Save.
      user.save(function(err) {

        // Set user id.
        req.user = user;

        // Call isSuper, check for next().
        auth.isSuper(req, res, next);
        sinon.assert.called(next);
        done();

      });

    });

  });

  describe('noUser', function() {

    it('should redirect when there is a user session', function(done) {

      // Spy on res.
      res.redirect = sinon.spy();

      // Create user.
      var user = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        active:     true,
        superUser:  true
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
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        active:     true,
        superUser:  true
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

  describe('noUsers', function() {

    it('should redirect when there is at least 1 user', function(done) {

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
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        active:     true,
        superUser:  true
      });

      // Save.
      user.save(function(err) {

        // Call noUsers, check for res.redirect().
        auth.noUsers(req, res, next);

      });

    });

    it('should call next() there are 0 users', function(done) {

      // Spy on next.
      next = sinon.spy();

      // Call noUsers, check for next().
      auth.noUser(req, res, next);
      sinon.assert.called(next);
      done();

    });

  });

  describe('nonSelf', function() {

    var user1, user2;

    beforeEach(function(done) {

      // Create user1.
      user1 = new User({
        username:   'david',
        password:   'password',
        email:      'david@test.com',
        superUser:  true,
        active:     true
      });

      // Create user2.
      user2 = new User({
        username:   'kara',
        password:   'password',
        email:      'kara@test.com',
        superUser:  true,
        active:     false
      });

      // Save worker.
      var save = function(user, callback) {
        user.save(function(err) {
          callback(null, user);
        });
      };

      // Save.
      async.map([user1, user2], save, function(err, users) {
        done();
      });

    });

    it('should redirect when the current user matches the topic user', function(done) {

      // Spy on res.
      res.redirect = sinon.spy(function() {
        sinon.assert.calledWith(res.redirect, '/admin');
        done();
      });

      // Spy on next.
      next = sinon.spy(function() {
        sinon.assert.calledWith(res.redirect, '/admin');
        done();
      });

      // Mock request object.
      req.params = { username: 'david' };
      req.user = user1;

      // Call nonSelf, check for res.redirect().
      auth.nonSelf(req, res, next);

    });

    it('should call next() when the current user does not match the topic user', function(done) {

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

      // Mock request object.
      req.params = { username: 'kara' };
      req.user = user1;

      // Call nonSelf, check for res.redirect().
      auth.nonSelf(req, res, next);

    });

  });

});
