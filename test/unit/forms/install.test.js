/*
 * Unit tests for install form.
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

// Poem model.
require('../../../app/models/poem');
var User = mongoose.model('Poem');

// Form and reserved slugs.
var installForm = require('../../../helpers/forms/install'),
  _slugs = require('../../../helpers/forms/_slugs');


/*
 * ------------------------
 * Install form unit tests.
 * ------------------------
 */


describe('Install Form', function() {

  var form;

  // Construct form.
  beforeEach(function() {
    form = installForm.form();
  });

  // Clear collections.
  afterEach(function(done) {
    User.collection.remove(function(err) { done(); });
  });

  describe('username', function() {

    it('should have a name attribute', function() {
      form.fields.username.name.should.be.ok;
    });

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

    it('should not be a reserved slug', function(done) {

      form.bind({
        username: _slugs.blacklist[0]
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

    it('should have a name attribute', function() {
      form.fields.password.name.should.be.ok;
    });

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

    it('should have a name attribute', function() {
      form.fields.confirm.name.should.be.ok;
    });

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

    it('should have a name attribute', function() {
      form.fields.email.name.should.be.ok;
    });

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
