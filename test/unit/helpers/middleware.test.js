/*
 * Unit tests for route middleware methods.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  sinon = require('sinon');

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

  });

});
