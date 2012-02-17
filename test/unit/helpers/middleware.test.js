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

  var req = { session: {} };
  var res = {};
  var next;

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

    it('should redirect a non-existent user', function() {

      // Spy on res.
      res.redirect = sinon.spy();

      req.session.user_id = 1;
      auth.isUser(req, res, next);
      sinon.assert.calledWith(res.redirect, '/admin/login');

    });

    it('should redirect an inactive user', function(done) {

      // Spy on res.
      res.redirect = sinon.spy();

      // Create inactive user.
      var user = new User({
        username: 'david',
        email:    'david@spyder.com',
        password: 'password'
      });

      // Save.
      user.save(function(err) {

        // Set user id and call isUser.
        req.session.user_id = user.id;
        auth.isUser(req, res, next);
        sinon.assert.calledWith(res.redirect, '/admin/login');
        done();

      });

    });

    it('should call next() for an active user', function(done) {

      // Spy on next;
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

        // Set user id and call isUser.
        req.session.user_id = user.id;
        auth.isUser(req, res, next);

      });

    });

  });

});
