/*
 * Unit tests for application startup.
 */

// Module dependencies.
var mocha = require('mocha');
var should = require('should');
var async = require('async');
var assert = require('assert');
var sinon = require('sinon');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../../db-connect');


/*
 * ----------------
 * Init unit tests.
 * ----------------
 */


describe('Init', function() {

  // Reset Oversoul namespace.
  afterEach(function() {
    delete global.Oversoul;
  });

  describe('run', function() {

    it('should shell out "votes" and "timers" objects');
    it('should set configuration options');
    it('should call startPoems()');

  });

  describe('startPoems', function() {

    it('should start running poems');
    it('should not poems that are not running');

  });

});
