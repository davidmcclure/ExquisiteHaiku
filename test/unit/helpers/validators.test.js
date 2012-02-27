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

  var form = {}, field = {}, callback;

  // Clear users.
  afterEach(function(done) {
    User.collection.remove(function(err) { done(); });
  });

  describe('usernameExists', function() {

    beforeEach(function() {
      field.data = 'david';
    });

    it('should not pass if there is not a user with the username', function(done) {

      // Get the validator.
      var validator = validators.usernameExists('err');

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Call the validator.
      validator(form, field, callback);

    });

    it('should pass if there is a user with the username', function(done) {

      // Get the validator.
      var validator = validators.usernameExists('err');

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Create a user.
      var user = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        superUser:  true,
        active:     true
      });

      // Save.
      user.save(function(err) {

        // Call the validator.
        validator(form, field, callback);

      });

    });

  });

  describe('usernameActive', function() {

    var user;

    beforeEach(function() {

      // Create user.
      user = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        superUser:  true
      });

      // Set field value.
      field.data = 'david';

    });

    it('should not pass if the user is inactive', function(done) {

      // Set inactive.
      user.active = false;

      // Get the validator.
      var validator = validators.usernameActive('err');

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Save the user.
      user.save(function(err) {

        // Call the validator.
        validator(form, field, callback);

      });

    });

    it('should pass if the user is active', function(done) {

      // Set active.
      user.active = true;

      // Get the validator.
      var validator = validators.usernameActive('err');

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Save the user.
      user.save(function(err) {

        // Call the validator.
        validator(form, field, callback);

      });

    });

  });

  describe('passwordCorrect', function() {

    var user;

    beforeEach(function(done) {

      // Create user.
      user = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        superUser:  true,
        active:     true
      });

      // Set field value.
      form.data = { username: 'david' };

      // Save user.
      user.save(function(err) { done(); });

    });

    it('should not pass if the password is incorrect', function(done) {

      // Set incorrect password.
      field.data = 'incorrect';

      // Get the validator.
      var validator = validators.passwordCorrect('err');

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Call the validator.
      validator(form, field, callback);

    });

    it('should pass if the password is correct', function(done) {

      // Set correct password.
      field.data = 'password';

      // Get the validator.
      var validator = validators.passwordCorrect('err');

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Call the validator.
      validator(form, field, callback);

    });

  });

  describe('uniqueField', function() {

    var user;

    beforeEach(function(done) {

      // Create user.
      user = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        superUser:  true,
        active:     true
      });

      // Save.
      user.save(function(err) { done(); });

    });

    it('should not pass if there is a doc with the column/field', function(done) {

      // Set existing username.
      field.data = 'david';

      // Get the validator.
      var validator = validators.uniqueField(User, 'username', 'err');

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Call the validator.
      validator(form, field, callback);

    });

    it('should pass if there is not a doc with the column/field', function(done) {

      // Set existing username.
      field.data = 'kara';

      // Get the validator.
      var validator = validators.uniqueField(User, 'username', 'err');

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Call the validator.
      validator(form, field, callback);

    });

  });

  describe('uniqueNonSelfField', function() {

    var user1, user2;

    beforeEach(function(done) {

      // Create user1.
      user1 = new User({
        username:   'david',
        email:      'david@spyder.com',
        password:   'password',
        superUser:  true,
        active:     true
      });

      // Create user2.
      user2 = new User({
        username:   'kara',
        email:      'kara@spyder.com',
        password:   'password',
        superUser:  true,
        active:     true
      });

      // Save.
      user1.save(function(err) {
        user2.save(function(err) {
          done();
        });
      });

    });

    it('should not pass when there is a non-self doc with the column/field', function(done) {

      // Set existing username.
      field.data = 'kara';

      // Get the validator.
      var validator = validators.uniqueNonSelfField(User, 'username', user1, 'err');

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Call the validator.
      validator(form, field, callback);

    });

    it('should pass when the self doc has the column/field', function(done) {

      // Set existing username.
      field.data = 'david';

      // Get the validator.
      var validator = validators.uniqueNonSelfField(User, 'username', user1, 'err');

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Call the validator.
      validator(form, field, callback);

    });

    it('should pass when the self doc does not have the column/field', function(done) {

      // Set existing username.
      field.data = 'rosie';

      // Get the validator.
      var validator = validators.uniqueNonSelfField(User, 'username', user1, 'err');

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Call the validator.
      validator(form, field, callback);

    });

  });

  describe('validSlug', function() {

    var validator;

    beforeEach(function() {

      // Get the validator.
      validator = validators.validSlug('err');

    });

    it('should not pass when the slug has spaces', function(done) {

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set invalid slug.
      field.data = 'slug with spaces';
      validator(form, field, callback);

    });

    it('should not pass when the slug has capital letters', function(done) {

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set invalid slug.
      field.data = 'Slug-With-Capitals';
      validator(form, field, callback);

    });

    it('should not pass when the slug has non-alphanumeric chars', function(done) {

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set invalid slug.
      field.data = 'slug-with-non-alphas!';
      validator(form, field, callback);

    });

  });

  describe('fieldAllowed', function() {

    var validator, blacklist;

    beforeEach(function() {

      // Define a blacklist.
      blacklist = ['value1', 'value2'];

      // Get the validator.
      validator = validators.fieldAllowed(blacklist, 'err');

    });

    it('should not pass when the field is present on the list', function(done) {

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set value on the blacklist.
      field.data = 'value1';
      validator(form, field, callback);

    });

    it('should not pass when the field is not present on the list', function(done) {

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Set invalid slug.
      field.data = 'value3';
      validator(form, field, callback);

    });

  });

  describe('uniqueSlug', function() {

    describe('when user is passed', function() {

      it('should not pass when there is another poem owned by the user with the slug');
      it('should pass when there is not another poem owned by the user with the slug');

    });

    describe('when a user is not passed', function() {

      it('should not pass when there is another poem owned by an admin user with the slug');
      it('should pass when there is not another poem owned by an admin user with the slug');

    });

  });

});
