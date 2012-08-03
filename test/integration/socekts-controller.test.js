/*
 * Integration tests for sockets controller.
 */

// Module dependencies.
var vows = require('mocha');
var should = require('should');
var assert = require('assert');
var Browser = require('zombie');
var helpers = require('../helpers');

// Bootstrap the application.
process.env.NODE_ENV = 'testing';
var server = require('../../app');

// Models.
var User = mongoose.model('User');

/*
 * -------------------------------------
 * Sockets controller integration tests.
 * -------------------------------------
 */


describe('Sockets Controller', function() {

  describe('join', function() {

  });

  describe('validate', function() {

  });

  describe('submit', function() {

  });

  describe('vote', function() {

  });

});
