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

// Poem model.
require('../../../app/models/poem');
var Poem = mongoose.model('Poem');

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

    // Truncate worker.
    var remove = function(model, callback) {
      model.collection.remove(function(err) {
        callback(err, model);
      });
    };

    // Truncate.
    async.map([User, Poem], remove, function(err, models) {
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

      // Create active user.
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

  describe('isAdmin', function() {

    it('should redirect when the user is not an admin', function(done) {

      // Spy on res.
      res.redirect = sinon.spy();

      // Create non-admin user.
      var user = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        admin:      false,
        active:     true,
        superUser:  true
      });

      // Save.
      user.save(function(err) {

        // Set user id.
        req.user = user;

        // Call isAdmin, check for redirect.
        auth.isAdmin(req, res, next);
        sinon.assert.calledWith(res.redirect, '/admin/poems');
        done();

      });

    });

    it('should call next() when the user is an admin', function(done) {

      // Spy on next.
      next = sinon.spy();

      // Create admin user.
      var user = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        admin:      true,
        active:     true,
        superUser:  true
      });

      // Save.
      user.save(function(err) {

        // Set user id.
        req.user = user;

        // Call isAdmin, check for next().
        auth.isAdmin(req, res, next);
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
        sinon.assert.calledWith(res.redirect, '/admin/poems');
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
        admin:      true,
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

  describe('getPoem', function() {

    var user, poem;

    beforeEach(function(done) {

      // Create user.
      user = new User({
        username:   'david',
        password:   'password',
        email:      'david@test.com',
        admin:      true
      });

      // Create poem.
      poem = new Poem({
        slug:             'poem',
        user:             user.id,
        roundLength :     10000,
        sliceInterval :   3,
        minSubmissions :  5,
        submissionVal :   100,
        decayLifetime :   50,
        seedCapital :     1000,
        visibleWords :    500
      });

      // Save worker.
      var save = function(document, callback) {
        document.save(function(err) {
          callback(null, document);
        });
      };

      // Save.
      async.map([user, poem], save, function(err, documents) {
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
      req.params = { slug: 'poem' };

      // Call getPoem, check for next() and poem.
      auth.getPoem(req, res, next);

    });

  });

});
