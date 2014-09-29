
/**
 * Unit tests for poem form.
 */

var _t = require('../../dependencies.js');
var poemForm = require('../../../helpers/forms/poem');
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');


describe('Poem Form', function() {

  var form;

  beforeEach(function() {
    form = poemForm();
  });

  // Clear collections.
  afterEach(function(done) {

    // Truncate.
    _t.async.map([
      User,
      Poem
    ], _t.helpers.remove, function(err, models) {
      done();
    });

  });

  describe('roundLengthValue', function() {

    it('should have a default value', function() {
      form.fields.roundLengthValue.value.should.exist;
    });

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
        should(!form.fields.roundLengthValue.error);
        done();
      });

    });

  });

  describe('roundLengthUnit', function() {

    it('should have a default value', function() {
      form.fields.roundLengthUnit.value.should.exist;
    });

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
        should(!form.fields.roundLengthUnit.error);
        done();
      });

    });

  });

  describe('submissionVal', function() {

    it('should have a default value', function() {
      form.fields.submissionVal.value.should.exist;
    });

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
        should(!form.fields.submissionVal.error);
        done();
      });

    });

  });

  describe('decayHalflife', function() {

    it('should have a default value', function() {
      form.fields.decayHalflife.value.should.exist;
    });

    it('should exist', function(done) {

      form.bind({
        decayHalflife: ''
      }).validate(function(err, form) {
        form.fields.decayHalflife.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        decayHalflife: -5
      }).validate(function(err, form) {
        form.fields.decayHalflife.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        decayHalflife: 5
      }).validate(function(err, form) {
        should(!form.fields.decayHalflife.error);
        done();
      });

    });

  });

});
