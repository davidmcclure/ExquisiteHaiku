/*
 * Integration tests for install controller.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  sinon = require('sinon');


/*
 * -------------------------------------
 * Install controller integration tests.
 * -------------------------------------
 */


describe('Install Controller', function() {

  beforeEach(function() {
  });

  afterEach(function(done) {
  });

  describe('GET /admin/install', function() {

    it('should redirect when there is an existing user');
    it('should render the form when there are no users');

  });

  describe('POST /admin/install', function() {

    describe('username', function() {

      it('should flash error for no username');
      it('should flash error for username < 4 characters');
      it('should flash error for username > 20 characters');

    });

    describe('password', function() {

      it('should flash error for no password');
      it('should flash error for username < 6 characters');

    });

    describe('confirm', function() {

      it('should flash error for no confirmation');
      it('should flash error for mismatch with password');

    });

    describe('email', function() {

      it('should flash error for no email');
      it('should flash error for invalid email');

    });

  });

});

