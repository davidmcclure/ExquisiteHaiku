/*
 * Unit tests for college model.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../../../app');

// Bootstrap models.
var College = mongoose.model('College');
var Publication = mongoose.model('Publication');


/*
 * ----------------------
 * College model unit tests.
 * ----------------------
 */


describe('College', function() {

  // Clear colleges.
  afterEach(function(done) {
    College.collection.remove(function(err) { done(); });
  });

  describe('required field validations', function() {

    it('should require a name', function(done) {

      // Create college with no name.
      var college = new College({
        slug:     'yale'
      });

      // Save.
      college.save(function(err) {

        // Check for error.
        err.errors.name.type.should.eql('required');

        // Check for 0 documents.
        College.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

    it('should require a slug', function(done) {

      // Create college with no slug.
      var college = new College({
        name:     'Yale'
      });

      // Save.
      college.save(function(err) {

        // Check for error.
        err.errors.slug.type.should.eql('required');

        // Check for 0 documents.
        College.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

  });

  describe('uniqueness constraints', function() {

    // Stub college.
    beforeEach(function(done) {

      // Create college.
      var college = new College({
        name: 'Yale',
        slug: 'yale'
      });

      // Save.
      college.save(function(err) { done(); });

    });

    it('should block duplicate names', function(done) {

      // Create a new college with a duplicate name.
      var dupCollege = new College({
        name: 'Yale',
        slug: 'different'
      });

      // Save.
      dupCollege.save(function(err) {

        // Check for error.
        err.code.should.eql(11000);

        // Check for 1 document.
        College.count({}, function(err, count) {
          count.should.eql(1);
          done();
        });

      });

    });

    it('should block duplicate slugs', function(done) {

      // Create a new college with a duplicate slug.
      var dupCollege = new College({
        name: 'Harvard',
        slug: 'yale'
      });

      // Save.
      dupCollege.save(function(err) {

        // Check for error.
        err.code.should.eql(11000);

        // Check for 1 document.
        College.count({}, function(err, count) {
          count.should.eql(1);
          done();
        });

      });

    });

  });

  describe('virtual field "id"', function() {

    var college;

    // Stub college.
    beforeEach(function(done) {
      college = new College();
      college.save(function(err) { done(); });
    });

    it('should have a virtual field for "id"', function() {
      college.id.should.be.ok;
    });

    it('should be a string', function() {
      college.id.should.be.a('string');
    });

  });

  describe('states enum', function() {

    it('should block non-existent state abbreviations', function(done) {

      // Create college with non-existent state.
      var college = new College({
        name:   'Yale',
        slug:   'yale',
        state:  'NA'
      });

      // Save.
      college.save(function(err) {

        // Check for error.
        err.errors.state.should.be.ok;

        // Check for 0 documents.
        College.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

    it('should allow valid state abbreviations', function(done) {

      // Create college with valid state.
      var college = new College({
        name:   'Yale',
        slug:   'yale',
        state:  'CT'
      });

      // Save.
      college.save(function(err) {

        // Check for no error.
        assert(!err);

        // Check for 1 documents.
        College.count({}, function(err, count) {
          count.should.eql(1);
          done();
        });

      });

    });

  });

});
