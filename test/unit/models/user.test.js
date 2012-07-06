/*
 * Unit tests for user model.
 */

// Module dependencies.
var vows = require('mocha');
var should = require('should');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../db-connect');

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

    it('should require username and admin', function(done) {

      // Create user with no username, set admin to null
      // to override default and check for error.
      var user = new User();
      user.admin = null;

      // Save.
      user.save(function(err) {

        // Check for errors.
        err.errors.username.type.should.eql('required');

        // Check for 0 documents.
        User.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

  });

  describe('uniqueness constraints', function() {

    // Stub user.
    beforeEach(function(done) {

      // Create user.
      var user = new User({ username: 'david' });

      // Save.
      user.save(function(err) { done(); });

    });

    it('should block duplicate usernames', function(done) {

      // Create a new user with a duplicate username.
      var dupUser = new User({ username: 'david' });

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
    beforeEach(function(done) {
      user = new User();
      user.save(function(err) { done(); });
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
