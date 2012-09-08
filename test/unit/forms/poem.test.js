/*
 * Unit tests for poem form.
 */

// Modules
// -------
var mocha = require('mocha');
var should = require('should');
var assert = require('assert');
var async = require('async');
var sinon = require('sinon');
var config = require('yaml-config');
var mongoose = require('mongoose');
var helpers = require('../../helpers');
var _ = require('underscore');


// Models
// ------

// User.
require('../../../app/models/user');
var User = mongoose.model('User');

// Poem.
require('../../../app/models/poem');
var Poem = mongoose.model('Poem');


// Helpers
// -------

// Login form.
var poemForm = require('../../../helpers/forms/poem');


// Config
// ------

var root = config.readConfig('test/config.yaml').root;


// Run
// ---

process.env.NODE_ENV = 'testing';
var server = require('../../../app');


// Specs
// -----

describe('Poem Form', function() {

  var form;

  beforeEach(function() {
    form = poemForm.form();
  });

  // Clear collections.
  afterEach(function(done) {

    // Truncate.
    async.map([
      User,
      Poem
    ], helpers.remove, function(err, models) {
      done();
    });

  });

  describe('roundLengthValue', function() {

    it('should exist', function(done) {

      form.bind({
        roundLengthValue: ''
      }).validate(function(err, form) {
        form.fields.roundLengthValue.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        roundLengthValue: -5
      }).validate(function(err, form) {
        form.fields.roundLengthValue.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        roundLengthValue: 1000
      }).validate(function(err, form) {
        assert(!form.fields.roundLengthValue.error);
        done();
      });

    });

  });

  describe('roundLengthUnit', function() {

    it('should exist', function(done) {

      form.bind({
        roundLengthUnit: ''
      }).validate(function(err, form) {
        form.fields.roundLengthUnit.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        roundLengthUnit: 'seconds'
      }).validate(function(err, form) {
        assert(!form.fields.roundLengthUnit.error);
        done();
      });

    });

  });

  describe('minSubmissions', function() {

    it('should exist', function(done) {

      form.bind({
        minSubmissions: ''
      }).validate(function(err, form) {
        form.fields.minSubmissions.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        minSubmissions: -5
      }).validate(function(err, form) {
        form.fields.minSubmissions.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        minSubmissions: 5
      }).validate(function(err, form) {
        assert(!form.fields.minSubmissions.error);
        done();
      });

    });

  });

  describe('submissionVal', function() {

    it('should exist', function(done) {

      form.bind({
        submissionVal: ''
      }).validate(function(err, form) {
        form.fields.submissionVal.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        submissionVal: -5
      }).validate(function(err, form) {
        form.fields.submissionVal.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        submissionVal: 5
      }).validate(function(err, form) {
        assert(!form.fields.submissionVal.error);
        done();
      });

    });

  });

  describe('decayLifetime', function() {

    it('should exist', function(done) {

      form.bind({
        decayLifetime: ''
      }).validate(function(err, form) {
        form.fields.decayLifetime.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        decayLifetime: -5
      }).validate(function(err, form) {
        form.fields.decayLifetime.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        decayLifetime: 5
      }).validate(function(err, form) {
        assert(!form.fields.decayLifetime.error);
        done();
      });

    });

  });

  describe('seedCapital', function() {

    it('should exist', function(done) {

      form.bind({
        seedCapital: ''
      }).validate(function(err, form) {
        form.fields.seedCapital.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        seedCapital: -5
      }).validate(function(err, form) {
        form.fields.seedCapital.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        seedCapital: 5
      }).validate(function(err, form) {
        assert(!form.fields.seedCapital.error);
        done();
      });

    });

  });

});
