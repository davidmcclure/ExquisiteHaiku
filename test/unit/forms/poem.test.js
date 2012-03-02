/*
 * Unit tests for poem form.
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

// Form and reserved slugs.
var poemForm = require('../../../helpers/forms/poem'),
  _slugs = require('../../../helpers/forms/_slugs');


/*
 * ---------------------
 * Poem form unit tests.
 * ---------------------
 */


describe('Poem Form', function() {

  var form;

  beforeEach(function() {
    form = poemForm.form();
  });

  // Clear collections.
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

  describe('slug', function() {

    it('should have a name attribute', function() {
      form.fields.slug.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        slug: ''
      }).validate(function(err, form) {
        form.fields.slug.error.should.be.ok;
        done();
      });

    });

    it('should be a valid slug', function(done) {

      form.bind({
        slug: 'invalid slug'
      }).validate(function(err, form) {
        form.fields.slug.error.should.be.ok;
        done();
      });

    });

    it('should be unique relative to user\'s poems when user is passed', function(done) {

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

          // Rebuild the form with the user.
          form = poemForm.form(user);

          form.bind({
            slug: 'taken-slug'
          }).validate(function(err, form) {
            form.fields.slug.error.should.be.ok;
            done();
          });

        });

      });

    });

    it('should be unique relative to all admin users\' poems when user is not passed', function(done) {

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
          admin: true,
          roundLength : 10000,
          sliceInterval : 3,
          minSubmissions : 5,
          submissionVal : 100,
          decayLifetime : 50,
          seedCapital : 1000
        });

        // Save poem.
        poem.save(function(err) {

          // Rebuild the form.
          form = poemForm.form();

          form.bind({
            slug: 'taken-slug'
          }).validate(function(err, form) {
            form.fields.slug.error.should.be.ok;
            done();
          });

        });

      });

    });

    it('should not be a reserved root-level slug when user is not passed', function(done) {

      form.bind({
        slug: _slugs.blacklist[0]
      }).validate(function(err, form) {
        form.fields.slug.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        slug: 'valid-slug'
      }).validate(function(err, form) {
        assert(!form.fields.slug.error);
        done();
      });

    });

  });

  describe('roundLength', function() {

    it('should have a name attribute', function() {
      form.fields.roundLength.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        roundLength: ''
      }).validate(function(err, form) {
        form.fields.roundLength.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        roundLength: -5
      }).validate(function(err, form) {
        form.fields.roundLength.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        roundLength: 1000
      }).validate(function(err, form) {
        assert(!form.fields.roundLength.error);
        done();
      });

    });

  });

  describe('sliceInterval', function() {

    it('should have a name attribute', function() {
      form.fields.roundLength.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        sliceInterval: ''
      }).validate(function(err, form) {
        form.fields.sliceInterval.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        sliceInterval: -5
      }).validate(function(err, form) {
        form.fields.sliceInterval.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        sliceInterval: 3
      }).validate(function(err, form) {
        assert(!form.fields.sliceInterval.error);
        done();
      });

    });

  });

  describe('minSubmissions', function() {

    it('should have a name attribute', function() {
      form.fields.minSubmissions.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        minSubmissions: ''
      }).validate(function(err, form) {
        form.fields.minSubmissions.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        minSubmissions: -5
      }).validate(function(err, form) {
        form.fields.minSubmissions.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        minSubmissions: 5
      }).validate(function(err, form) {
        assert(!form.fields.minSubmissions.error);
        done();
      });

    });

  });

  describe('submissionVal', function() {

    it('should have a name attribute', function() {
      form.fields.submissionVal.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        submissionVal: ''
      }).validate(function(err, form) {
        form.fields.submissionVal.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        submissionVal: -5
      }).validate(function(err, form) {
        form.fields.submissionVal.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        submissionVal: 5
      }).validate(function(err, form) {
        assert(!form.fields.submissionVal.error);
        done();
      });

    });

  });

  describe('decayLifetime', function() {

    it('should have a name attribute', function() {
      form.fields.decayLifetime.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        decayLifetime: ''
      }).validate(function(err, form) {
        form.fields.decayLifetime.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        decayLifetime: -5
      }).validate(function(err, form) {
        form.fields.decayLifetime.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        decayLifetime: 5
      }).validate(function(err, form) {
        assert(!form.fields.decayLifetime.error);
        done();
      });

    });

  });

  describe('seedCapital', function() {

    it('should have a name attribute', function() {
      form.fields.seedCapital.name.should.be.ok;
    });

    it('should exist', function(done) {

      form.bind({
        seedCapital: ''
      }).validate(function(err, form) {
        form.fields.seedCapital.error.should.be.ok;
        done();
      });

    });

    it('should be a positive integer', function(done) {

      form.bind({
        seedCapital: -5
      }).validate(function(err, form) {
        form.fields.seedCapital.error.should.be.ok;
        done();
      });

    });

    it('should validate when valid', function(done) {

      form.bind({
        seedCapital: 5
      }).validate(function(err, form) {
        assert(!form.fields.seedCapital.error);
        done();
      });

    });

  });

});
