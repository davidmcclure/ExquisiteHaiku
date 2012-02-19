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

// Validators.
var validators = require('../../../helpers/validators');


/*
 * ---------------------------------
 * Custom form validator unit tests.
 * ---------------------------------
 */


describe('Custom Validators', function() {

  describe('usernameExists', function() {

    it('should not pass if there is not a user with the username');

    it('should pass if there is a user with the username');

  });

  describe('usernameActive', function() {

    it('should not pass if the user is inactive');

    it('should pass if the user is active');

  });

  describe('passwordCorrect', function() {

    it('should not pass if the password is incorrect');

    it('should pass if the password is correct');

  });

});
