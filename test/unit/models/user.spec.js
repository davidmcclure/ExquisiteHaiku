/*
 * Unit tests for user model.
 */

// Module dependencies.
var vows = require('mocha'),
  assert = require('should');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../../../app');

// Bootstrap models.
var User = mongoose.model('User');


/*
 * ----------------------
 * User model unit tests.
 * ----------------------
 */


describe('User', function() {

  // Clear user collection after each suite.
  afterEach(function(done) {
    User.collection.remove(function(err) { done(); });
  });

  describe('uniqueness constraints', function() {

    // Stub user.
    beforeEach(function(done) {

      // Create user.
      var user = new User({
        username:   'david',
        email:      'david@spyder.com'
      });

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

    it('should block duplicate emails', function(done) {

      // Create a new user with a duplicate email.
      var dupUser = new User({ email: 'david@spyder.com' });

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

  describe('boolean field defaults', function() {

    var user;

    // Stub user.
    beforeEach(function() {
      user = new User();
    });

    it('should set superUser false by default', function(done) {

      // Check for superUser false.
      user.save(function(err) {
        user.superUser.should.be.false;
        done();
      });

    });

    it('should set active false by default', function(done) {

      // Check for superUser false.
      user.save(function(err) {
        user.active.should.be.false;
        done();
      });

    });

  });

});
