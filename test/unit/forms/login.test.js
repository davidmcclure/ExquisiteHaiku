/*
 * Unit tests for login form.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  sinon = require('sinon');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../db-connect')

// User model.
require('../../../app/models/user');
var User = mongoose.model('User');;

// Form.
var loginForm = require('../../../helpers/forms/login');


/*
 * ----------------------
 * Login form unit tests.
 * ----------------------
 */


describe('Login Form', function() {

  var form, user;

  beforeEach(function(done) {

    // Create the form.
    form = loginForm.form();

    // Create user.
    user = new User({
      username:   'david',
      email:      'david@spyder.com',
      password:   'password',
      active:     true,
      superUser:  true
    });

    user.save(function(err) { done(); });

  });

  // Clear users.
  afterEach(function(done) {
    User.collection.remove(function(err) { done(); });
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

    it('should match a user in the database', function(done) {

      form.bind({
        username: 'kara'
      }).validate(function(err, form) {
        form.fields.username.error.should.be.ok;
        done();
      });

    });

    it('should match an active user in the database', function(done) {

      // Set user inactive.
      user.active = false;

      // Save.
      user.save(function(err) {

        form.bind({
          username: 'david'
        }).validate(function(err, form) {
          form.fields.username.error.should.be.ok;
          done();
        });

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

    it('should validate when valid', function(done) {

      form.bind({
        username: 'david',
        password: 'password'
      }).validate(function(err, form) {
        assert(!form.fields.password.error);
        done();
      });

    });

  });

});
