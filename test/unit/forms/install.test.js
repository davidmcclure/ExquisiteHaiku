/*
 * Unit tests for install form.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  sinon = require('sinon');

// Form.
var installForm = require('../../../helpers/forms/install');


/*
 * ------------------------
 * Install form unit tests.
 * ------------------------
 */


describe('Install Form', function() {

  beforeEach(function() {
  });

  afterEach(function(done) {
  });

  describe('username', function() {

    it('should exist');
    it('should be > 4 characters');
    it('should be < 20 characters');

  });

  describe('password', function() {

    it('should exist');
    it('should be greater than 6 characters');

  });

  describe('confirm', function() {

    it('should exist');
    it('should match the password');

  });

  describe('email', function() {

    it('should exist');
    it('should be valid');

  });

});
