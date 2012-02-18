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

  var form;

  beforeEach(function() {
    form = installForm.form();
  });

  describe('username', function() {

    it('should exist', function(done) {

      form.bind({
        username: ''
      }).validate(function(err, form) {
        form.fields.username.error.should.be.ok;
        done();
      });

    });

    it('should be >= 4 characters', function(done) {

      form.bind({
        username: 'dav'
      }).validate(function(err, form) {
        form.fields.username.error.should.be.ok;
        done();
      });

    });

    it('should be <= 20 characters', function(done) {

      form.bind({
        username: 'supercalafragalisticexpialadocious'
      }).validate(function(err, form) {
        form.fields.username.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        username: 'david'
      }).validate(function(err, form) {
        assert(!form.fields.username.error);
        done();
      });

    });

  });

  describe('password', function() {

    it('should exist', function(done) {

      form.bind({
        password: ''
      }).validate(function(err, form) {
        form.fields.password.error.should.be.ok;
        done();
      });

    });

    it('should be greater than 6 characters', function(done) {

      form.bind({
        password: 'pass'
      }).validate(function(err, form) {
        form.fields.password.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        password: 'password'
      }).validate(function(err, form) {
        assert(!form.fields.password.error);
        done();
      });

    });

  });

  describe('confirm', function() {

    it('should exist', function(done) {

      form.bind({
        password: 'password',
        confirm: ''
      }).validate(function(err, form) {
        form.fields.confirm.error.should.be.ok;
        done();
      });

    });

    it('should match the password', function(done) {

      form.bind({
        password: 'password',
        confirm: 'mismatch'
      }).validate(function(err, form) {
        form.fields.confirm.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        password: 'password',
        confirm: 'password'
      }).validate(function(err, form) {
        assert(!form.fields.confirm.error);
        done();
      });

    });

  });

  describe('email', function() {

    it('should exist', function(done) {

      form.bind({
        email: ''
      }).validate(function(err, form) {
        form.fields.email.error.should.be.ok;
        done();
      });

    });

    it('should be valid', function(done) {

      form.bind({
        email: 'invalid'
      }).validate(function(err, form) {
        form.fields.email.error.should.be.ok;
        done();
      });

    });

    it('should vaidate when valid', function(done) {

      form.bind({
        email: 'david@spyder.com'
      }).validate(function(err, form) {
        assert(!form.fields.email.error);
        done();
      });

    });

  });

});
