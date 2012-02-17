/*
 * Unit tests for route middleware methods.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../db-connect');

// User model.
require('../../../app/models/user');
var User = mongoose.model('User');

// Middleware.
var auth = require('../../../helpers/middleware');


/*
 * ----------------------
 * Route middleware unit tests.
 * ----------------------
 */


describe('Route Middleware', function() {

  // Clear users.
  afterEach(function(done) {
    User.collection.remove(function(err) { done(); });
  });

  describe('stub', function() {

    it('test', function() {
      true.should.be.true;
    });

  });

});
