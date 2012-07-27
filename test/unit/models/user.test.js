/*
 * Unit tests for user model.
 */

// Module dependencies.
var vows = require('mocha');
var should = require('should');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../../db-connect');

// User model.
require('../../../app/models/user');
var User = mongoose.model('User');


/*
 * ----------------------
 * User model unit tests.
 * ----------------------
 */


describe('User', function() {

  // Clear users.
  afterEach(function(done) {
    User.collection.remove(function(err) { done(); });
  });

  describe('required field validations', function() {

    it('should require username and email', function(done) {

      // Create user, null fields.
      var user = new User();
      user.created = null;

      // Save.
      user.save(function(err) {

        // Check for errors.
        err.errors.username.type.should.eql('required');
        err.errors.created.type.should.eql('required');
        err.errors.email.type.should.eql('required');

        // Check for 0 documents.
        User.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

  });

  describe('field defaults', function() {

    var user;

    // Stub user.
    beforeEach(function() {
      user = new User();
    });

    it('should set "created" to the current date by default', function() {
      user.created.should.be.ok;
    });

  });

  describe('uniqueness constraints', function() {

    // Stub user.
    beforeEach(function(done) {

      // Create user.
      var user = new User({
        username: 'david',
        email: 'david@test.org'
      });

      // Save.
      user.save(function(err) {
        done();
      });

    });

    it('should block duplicate usernames', function(done) {

      // Create a new user with duplicate username.
      var dupUser = new User({
        username: 'david',
        email: 'david2@test.org'
      });

      // Save.
      dupUser.save(function(err) {

        // Check for error.
        err.code.should.eql(11000);

        // Check for 1 document.
        User.count({}, function(err, count) {
          count.should.eql(1);
          done();
        });

      });

    });

    it('should block duplicate email addresses', function(done) {

      // Create a new user with duplicate email.
      var dupUser = new User({
        username: 'david2',
        email: 'david@test.org'
      });

      // Save.
      dupUser.save(function(err) {

        // Check for error.
        err.code.should.eql(11000);

        // Check for 1 document.
        User.count({}, function(err, count) {
          count.should.eql(1);
          done();
        });

      });

    });

  });

  describe('virtual field "id"', function() {

    var user;

    // Stub user.
    beforeEach(function() {
      user = new User();
    });

    it('should have a virtual field for "id"', function() {
      should.exist(user.id);
    });

    it('should be a string', function() {
      user.id.should.be.a('string');
    });

  });

  describe('virtual field "password"', function() {

    var user;

    // Stub user.
    beforeEach(function() {
      user = new User({ password: 'password' });
    });

    it('should set _password, salt, and hash', function() {
      user._password.should.be.ok;
      user.salt.should.be.ok;
      user.hash.should.be.ok;
    });

    it('should have a virtual field for "password"', function() {
      user.password.should.be.ok;
    });

  });

  describe('password authentication', function() {

    var user;

    // Stub user.
    beforeEach(function() {
      user = new User({ password: 'password' });
    });

    it('should return true for correct password', function() {
      user.authenticate('password').should.be.true;
    });

    it('should return false for incorrect password', function() {
      user.authenticate('wrong').should.be.false;
    });

  });

});
