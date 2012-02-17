/*
 * Unit tests for publication model.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('./db-connect');

// College model.
require('../../../app/models/college');
var College = mongoose.model('College');

// Publication model.
require('../../../app/models/publication');
var Publication = mongoose.model('Publication');


/*
 * -----------------------------
 * Publication model unit tests.
 * -----------------------------
 */


describe('Publication', function() {

  var college;

  // Stub college.
  beforeEach(function(done) {

    // Create college.
    college = new College({
      name: 'Yale',
      slug: 'yale'
    });

    // Save.
    college.save(function(err) { done(); });

  });

  // Clear publications.
  afterEach(function(done) {
    Publication.collection.remove(function(err) { done(); });
  });

  // Clear colleges.
  afterEach(function(done) {
    College.collection.remove(function(err) { done(); });
  });

  describe('required field validations', function() {

    it('should require a name', function(done) {

      // Create publication with no name.
      var publication = new Publication({
        slug:     'yale-herald',
        url:      'http://yaleherald.com',
        college:  college._id
      });

      // Save.
      publication.save(function(err) {

        // Check for error.
        err.errors.name.type.should.eql('required');

        // Check for 0 documents.
        Publication.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

    it('should require a slug', function(done) {

      // Create publication with no slug.
      var publication = new Publication({
        name:     'The Yale Herald',
        url:      'http://yaleherald.com',
        college:  college._id
      });

      // Save.
      publication.save(function(err) {

        // Check for error.
        err.errors.slug.type.should.eql('required');

        // Check for 0 documents.
        Publication.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

    it('should require a url', function(done) {

      // Create publication with no url.
      var publication = new Publication({
        name:     'The Yale Herald',
        slug:     'yale-herald',
        college:  college._id
      });

      // Save.
      publication.save(function(err) {

        // Check for error.
        err.errors.url.type.should.eql('required');

        // Check for 0 documents.
        Publication.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

    it('should require a college reference', function(done) {

      // Create publication with no college reference.
      var publication = new Publication({
        name:     'The Yale Herald',
        slug:     'yale-herald',
        url:      'http://yaleherald.com'
      });

      // Save.
      publication.save(function(err) {

        // Check for error.
        err.errors.college.type.should.eql('required');

        // Check for 0 documents.
        Publication.count({}, function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

  });

  describe('uniqueness constraints', function() {

    var college;

    // Stub college.
    beforeEach(function(done) {

      // Create college.
      college = new College({
        name: 'Yale',
        slug: 'yale'
      });

      // Save.
      college.save(function(err) {

        // Create publication.
        var publication = new Publication({
          name:     'The Yale Herald',
          slug:     'yale-herald',
          url:      'http://yaleherald.com',
          college:  college._id
        });

        // Save publication.
        publication.save(function(err) { done(); });

      });

    });

    it('should block duplicate names', function(done) {

      // Create a new publication with a duplicate name.
      var dupPub = new Publication({
        name:     'The Yale Herald',
        slug:     'different-slug',
        url:      'http://different-url.com',
        college:  college._id
      });

      // Save.
      dupPub.save(function(err) {

        // Check for error.
        err.code.should.eql(11000);

        // Check for 1 document.
        Publication.count({}, function(err, count) {
          count.should.eql(1);
          done();
        });

      });

    });

    it('should block duplicate slugs', function(done) {

      // Create a new publication with a duplicate slug.
      var dupPub = new Publication({
        name:     'Different Name',
        slug:     'yale-herald',
        url:      'http://different-url.com',
        college:  college._id
      });

      // Save.
      dupPub.save(function(err) {

        // Check for error.
        err.code.should.eql(11000);

        // Check for 1 document.
        Publication.count({}, function(err, count) {
          count.should.eql(1);
          done();
        });

      });

    });

    it('should block duplicate urls', function(done) {

      // Create a new publication with a duplicate url.
      var dupPub = new Publication({
        name:     'Different Name',
        slug:     'different-slug',
        url:      'http://yaleherald.com',
        college:  college._id
      });

      // Save.
      dupPub.save(function(err) {

        // Check for error.
        err.code.should.eql(11000);

        // Check for 1 document.
        Publication.count({}, function(err, count) {
          count.should.eql(1);
          done();
        });

      });

    });

  });

  describe('virtual field "id"', function() {

    var publication;

    // Stub publication.
    beforeEach(function(done) {

      publication = new Publication({
        name:     'The Yale Herald',
        slug:     'yale-herald',
        url:      'http://yaleherald.com',
        college:  college._id
      });

      // Save.
      publication.save(function(err) { done(); });

    });

    it('should have a virtual field for "id"', function() {
      publication.id.should.be.ok;
    });

    it('should be a string', function() {
      publication.id.should.be.a('string');
    });

  });

});
