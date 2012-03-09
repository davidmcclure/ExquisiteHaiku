/*
 * Unit tests for route middleware methods.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  sinon = require('sinon'),
  async = require('async');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../db-connect');

// User model.
require('../../../app/models/user');
var User = mongoose.model('User');

// Poem model.
require('../../../app/models/poem');
var Poem = mongoose.model('Poem');

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

    // Truncate worker.
    var remove = function(model, callback) {
      model.collection.remove(function(err) {
        callback(err, model);
      });
    };

    // Truncate.
    async.map([User, Poem], remove, function(err, models) {
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
        email:      'david@test.com',
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

  describe('passwordCorrect', function() {

    var user;

    beforeEach(function(done) {

      // Create user.
      user = new User({
        username:   'david',
        email:      'david@test.com',
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

    it('should not pass if the user does not exist', function(done) {

      // Set non-existent user.
      form.data = { username: 'doesnotexist' };

      // Set incorrect password.
      field.data = 'password';

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
        email:      'david@test.com',
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
        email:      'david@test.com',
        password:   'password',
        superUser:  true,
        active:     true
      });

      // Create user2.
      user2 = new User({
        username:   'kara',
        email:      'kara@test.com',
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

    it('should pass when slug is valid', function(done) {

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.neverCalledWith(callback, 'err');
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

    var validator;

    describe('when user is passed', function() {

      beforeEach(function(done) {

        // Create user.
        var user = new User({
          username:   'david',
          email:      'david@test.com',
          password:   'password',
          admin:      false,
          superUser:  false,
          active:     true
        });

        // Save user.
        user.save(function(err) {

          // Create poem.
          var poem = new Poem({
            slug: 'taken-slug',
            user: user.id,
            admin: false,
            roundLength : 10000,
            sliceInterval : 3,
            minSubmissions : 5,
            submissionVal : 100,
            decayLifetime : 50,
            seedCapital : 1000
          });

          // Save poem.
          poem.save(function(err) {
            validator = validators.uniqueSlug(user, 'err');
            done();
          });

        });

      });

      it('should not pass when there is another poem owned by the user with the slug', function(done) {

        // Spy on callback.
        callback = sinon.spy(function() {
          sinon.assert.calledWith(callback, 'err');
          done();
        });

        // Set taken slug.
        field.data = 'taken-slug';
        validator(form, field, callback);

      });

      it('should pass when there is not another poem owned by the user with the slug', function(done) {

        // Spy on callback.
        callback = sinon.spy(function() {
          sinon.assert.neverCalledWith(callback, 'err');
          done();
        });

        // Set available slug.
        field.data = 'available-slug';
        validator(form, field, callback);

      });

    });

    describe('when a user is not passed', function() {

      beforeEach(function(done) {

        // Create user1.
        var user1 = new User({
          username:   'david',
          email:      'david@test.com',
          password:   'password',
          admin:      true,
          superUser:  true,
          active:     true
        });

        // Create user2.
        var user2 = new User({
          username:   'david',
          email:      'david@test.com',
          password:   'password',
          admin:      true,
          superUser:  true,
          active:     true
        });

        // Save worker.
        var save = function(user, callback) {
          user.save(function(err) {
            callback(null, user);
          });
        };

        // Save users.
        async.map([user1, user2], save, function(err, users) {

          // Create poem1.
          var poem1 = new Poem({
            slug: 'taken-slug',
            user: user1.id,
            admin: true,
            roundLength : 10000,
            sliceInterval : 3,
            minSubmissions : 5,
            submissionVal : 100,
            decayLifetime : 50,
            seedCapital : 1000
          });

          // Create poem2.
          var poem2 = new Poem({
            slug: 'another-taken-slug',
            user: user1.id,
            admin: false,
            roundLength : 10000,
            sliceInterval : 3,
            minSubmissions : 5,
            submissionVal : 100,
            decayLifetime : 50,
            seedCapital : 1000
          });

          // Save poems.
          async.map([poem1, poem2], save, function(err, poems) {
            validator = validators.uniqueSlug(undefined, 'err');
            done();
          });

        });

      });

      it('should not pass when there is another poem owned by an admin user with the slug', function(done) {

        // Spy on callback.
        callback = sinon.spy(function() {
          sinon.assert.calledWith(callback, 'err');
          done();
        });

        // Set taken slug.
        field.data = 'taken-slug';
        validator(form, field, callback);

      });

      it('should pass when there is not another poem owned by an admin user with the slug', function(done) {

        // Spy on callback.
        callback = sinon.spy(function() {
          sinon.assert.neverCalledWith(callback, 'err');
          done();
        });

        // Set available slug.
        field.data = 'available-slug';
        validator(form, field, callback);

      });

      it('should pass when there is a non-admin poem owned by an admin user with the slug', function(done) {

        // Spy on callback.
        callback = sinon.spy(function() {
          sinon.assert.neverCalledWith(callback, 'err');
          done();
        });

        // Set available slug.
        field.data = 'another-taken-slug';
        validator(form, field, callback);

      });

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
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set negative integer.
      field.data = -4;
      validator(form, field, callback);

    });

    it('should not pass for negative float', function(done) {

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set negative float.
      field.data = -4.5;
      validator(form, field, callback);

    });

    it('should not pass for positive float', function(done) {

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set positive float.
      field.data = 4.5;
      validator(form, field, callback);

    });

    it('should not pass for NaN', function(done) {

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.calledWith(callback, 'err');
        done();
      });

      // Set NaN.
      field.data = 'NaN';
      validator(form, field, callback);

    });

    it('should pass for a positive integer', function(done) {

      // Spy on callback.
      callback = sinon.spy(function() {
        sinon.assert.neverCalledWith(callback, 'err');
        done();
      });

      // Set positive integer.
      field.data = 4;
      validator(form, field, callback);

    });

  });

});
