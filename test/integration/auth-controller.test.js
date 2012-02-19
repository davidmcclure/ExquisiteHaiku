/*
 * Integration tests for auth controller.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  Browser = require('zombie');

// Bootstrap the application.
process.env.NODE_ENV = 'testing';
require('../../app');

// Models.
var User = mongoose.model('User');

/*
 * ----------------------------------
 * Auth controller integration tests.
 * ----------------------------------
 */


describe('Auth Controller', function() {

  var browser = new Browser();
  var r = 'http://localhost:3000/';

  // Clear users.
  afterEach(function(done) {
    User.collection.remove(function(err) { done(); });
  });

  describe('GET /admin/login', function() {

    it('should render the form when there is not a user session');

    it('should redirect when there is a user session');

  });

  describe('POST /admin/install', function() {

    describe('username', function() {

      it('should flash error for no username');

      it('should flash error for non-existent username');

      it('should flash error for inactive username');

      it('should not flash an error when the username is valid');

    });

    describe('password', function() {

      it('should flash error for no password');

      it('should flash error for incorrect password');

    });

    describe('success', function() {

      it('should create a session and redirect for valid form');

    });

  });

});

