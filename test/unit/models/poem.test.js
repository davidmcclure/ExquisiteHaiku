/*
 * Unit tests for poem model.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
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


/*
 * ----------------------
 * Poem model unit tests.
 * ----------------------
 */


describe('Poem', function() {

  var user;

  beforeEach(function(done) {

    // Create user.
    user = new User({
      username:   'david',
      password:   'password',
      email:      'david@test.com',
      superUser:  true,
      active:     true
    });

    // Save.
    user.save(function(err) { done(); });

  });

  // Clear users and poems.
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

  describe('required field validations', function() {

    it('should require all fields', function(done) {

      // Create poem empty fields, manually set created field
      // to override the default.
      var poem = new Poem();
      poem.created = null;

      // Save.
      poem.save(function(err) {

        // Check for errors.
        err.errors.slug.type.should.eql('required');
        err.errors.user.type.should.eql('required');
        err.errors.admin.type.should.eql('required');
        err.errors.created.type.should.eql('required');
        err.errors.roundLength.type.should.eql('required');
        err.errors.sliceInterval.type.should.eql('required');
        err.errors.minSubmissions.type.should.eql('required');
        err.errors.submissionVal.type.should.eql('required');
        err.errors.decayLifetime.type.should.eql('required');
        err.errors.seedCapital.type.should.eql('required');

        // Check for 0 documents.
        Poem.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

  });

  describe('field defaults', function() {

    var poem;

    beforeEach(function(done) {

      // Create poem.
      poem = new Poem({
        slug: 'test-poem',
        user: user.id,
        admin: true,
        roundLength : 10000,
        sliceInterval : 3,
        minSubmissions : 5,
        submissionVal : 100,
        decayLifetime : 50,
        seedCapital : 1000
      });

      poem.save(function(err) { done(); });

    });

    it('should set "created" to the current date by default', function() {
      poem.created.should.be.ok;
    });

  });

  describe('virtual field "id"', function() {

    var poem;

    beforeEach(function(done) {

      // Create poem.
      poem = new Poem({
        slug: 'test-poem',
        user: user.id,
        admin: true,
        roundLength : 10000,
        sliceInterval : 3,
        minSubmissions : 5,
        submissionVal : 100,
        decayLifetime : 50,
        seedCapital : 1000
      });

      poem.save(function(err) { done(); });

    });

    it('should have a virtual field for "id"', function() {
      poem.id.should.be.ok;
    });

    it('should be a string', function() {
      poem.id.should.be.a('string');
    });

  });

});
