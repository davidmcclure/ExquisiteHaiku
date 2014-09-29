
/**
 * Unit tests for route middleware methods.
 */

var _t = require('../../dependencies.js');
var validators = require('../../../helpers/validators');
var mongoose = require('mongoose');
var User = mongoose.model('User');


describe('Custom Validators', function() {

  var form = {}, field = {}, callback;

  // Clear users.
  afterEach(function(done) {

    // Truncate.
    _t.async.map([
      User
    ], _t.helpers.remove, function(err, models) {
      done();
    });

  });

  describe('usernameExists', function() {

    beforeEach(function() {
      field.data = 'david';
    });

    it('should not pass if there is not a user with the username', function(done) {

      // Get the validator.
      var validator = validators.usernameExists('err');

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Call the validator.
      validator(form, field, callback);

    });

    it('should pass if there is a user with the username', function(done) {

      // Get the validator.
      var validator = validators.usernameExists('err');

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Create a user.
      var user = new User({
        username: 'david',
        password: 'password',
        email: 'david@test.org'
      });

      // Call the validator.
      user.save(function(err) {
        validator(form, field, callback);
      });

    });

  });

  describe('passwordCorrect', function() {

    var user;

    beforeEach(function(done) {

      // Create user.
      user = new User({
        username: 'david',
        password: 'password',
        email: 'david@test.org'
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
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Call the validator.
      validator(form, field, callback);

    });

    it('should not pass if the user does not exist', function(done) {

      // Set non-existent user.
      form.data = { username: 'doesnotexist' };

      // Set incorrect password.
      field.data = 'password';

      // Get the validator.
      var validator = validators.passwordCorrect('err');

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
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
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.neverCalledWith(callback, 'err');
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
        username: 'david',
        password: 'password',
        email: 'david@test.org'
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
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
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
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.neverCalledWith(callback, 'err');
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
        username: 'david',
        password: 'password',
        email: 'david@test.org'
      });

      // Create user2.
      user2 = new User({
        username: 'kara',
        password: 'password',
        email: 'kara@test.org'
      });

      // Save.
      _t.async.map([
        user1,
        user2
      ], _t.helpers.save, function(err, documents) {
        done();
      });

    });

    it('should not pass when there is a non-self doc with the column/field', function(done) {

      // Set existing username.
      field.data = 'kara';

      // Get the validator.
      var validator = validators.uniqueNonSelfField(
        User, 'username', user1, 'err'
      );

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Call the validator.
      validator(form, field, callback);

    });

    it('should pass when the self doc has the column/field', function(done) {

      // Set existing username.
      field.data = 'david';

      // Get the validator.
      var validator = validators.uniqueNonSelfField(
        User, 'username', user1, 'err'
      );

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Call the validator.
      validator(form, field, callback);

    });

    it('should pass when the self doc does not have the column/field', function(done) {

      // Set non-existent username.
      field.data = 'rosie';

      // Get the validator.
      var validator = validators.uniqueNonSelfField(
        User, 'username', user1, 'err'
      );

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.neverCalledWith(callback, 'err');
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
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set invalid slug.
      field.data = 'slug with spaces';
      validator(form, field, callback);

    });

    it('should not pass when the slug has capital letters', function(done) {

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set invalid slug.
      field.data = 'Slug-With-Capitals';
      validator(form, field, callback);

    });

    it('should not pass when the slug has non-alphanumeric chars', function(done) {

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set invalid slug.
      field.data = 'slug-with-non-alphas!';
      validator(form, field, callback);

    });

    it('should pass when slug is valid', function(done) {

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Set valid slug.
      field.data = 'valid-slug';
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
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set value on the blacklist.
      field.data = 'value1';
      validator(form, field, callback);

    });

    it('should not pass when the field is not present on the list', function(done) {

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Set invalid slug.
      field.data = 'value3';
      validator(form, field, callback);

    });

  });

  describe('positiveInteger', function() {

    var validator;

    beforeEach(function() {

      // Get the validator.
      validator = validators.positiveInteger('err');

    });

    it('should not pass for negative integer', function(done) {

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set negative integer.
      field.data = -4;
      validator(form, field, callback);

    });

    it('should not pass for negative float', function(done) {

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set negative float.
      field.data = -4.5;
      validator(form, field, callback);

    });

    it('should not pass for positive float', function(done) {

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set positive float.
      field.data = 4.5;
      validator(form, field, callback);

    });

    it('should not pass for NaN', function(done) {

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set NaN.
      field.data = 'NaN';
      validator(form, field, callback);

    });

    it('should pass for a positive integer', function(done) {

      // Spy on callback.
      callback = _t.sinon.spy(function() {
        _t.sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Set positive integer.
      field.data = 4;
      validator(form, field, callback);

    });

  });

});
