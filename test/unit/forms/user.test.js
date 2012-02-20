/*
 * Unit tests for user forms.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  sinon = require('sinon');

// Form.
var userForms = require('../../../helpers/forms/user');


/*
 * ----------------------
 * User forms unit tests.
 * ----------------------
 */


describe('User Forms', function() {

  var form;

  // Clear users.
  afterEach(function(done) {
    User.collection.remove(function(err) { done(); });
  });

  describe('newUser', function() {

    describe('username', function() {

      it('should exist');

      it('should be >= 4 characters');

      it('should be <= 20 characters');

      it('should be unique');

      it('should validate when valid');

    });

    describe('password', function() {

      it('should exist');

      it('should be greater than 6 characters');

      it('should validate when valid');

    });

    describe('confirm', function() {

      it('should exist');

      it('should match the password');

      it('should validate when valid');

    });

    describe('email', function() {

      it('should exist');

      it('should be valid');

      it('should validate when valid');

    });

   });

});
