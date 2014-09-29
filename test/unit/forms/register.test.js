
/**
 * Unit tests for registration form.
 */

var _t = require('../../dependencies.js');
var registerForm = require('../../../helpers/forms/register');


describe('Register Form', function() {

  var form;

  // Construct form.
  beforeEach(function() {
    form = registerForm();
  });

  // Clear collections.
  afterEach(function(done) {
    _t.User.collection.remove(function(err) { done(); });
  });

  describe('username', function() {

    beforeEach(function(done) {

      // Create a user.
      var user = new _t.User({
        username: 'kara',
        email: 'kara@test.org'
      });

      user.save(function(err) { done(); });

    });

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

    it('should be unique', function(done) {

      form.bind({
        username: 'kara'
      }).validate(function(err, form) {
        form.fields.username.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        username: 'david'
      }).validate(function(err, form) {
        _t.assert(!form.fields.username.error);
        done();
      });

    });

  });

  describe('email', function() {

    beforeEach(function(done) {

      // Create a user.
      var user = new _t.User({
        username: 'kara',
        email: 'kara@test.org'
      });

      user.save(function(err) { done(); });

    });

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

    it('should be unique', function(done) {

      form.bind({
        email: 'kara@test.org'
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

    it('should validate when valid', function(done) {

      form.bind({
        email: 'david@test.org'
      }).validate(function(err, form) {
        _t.assert(!form.fields.email.error);
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
        _t.assert(!form.fields.password.error);
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
        _t.assert(!form.fields.confirm.error);
        done();
      });

    });

  });

});
