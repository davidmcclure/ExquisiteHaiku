/*
 * Unit tests for publication model.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert');

// Boostrap the application.
process.env.NODE_ENV = 'testing';
require('../../../app');

// Bootstrap models.
var Publication = mongoose.model('Publication');
var College = mongoose.model('College');


/*
 * -----------------------------
 * Publication model unit tests.
 * -----------------------------
 */


describe('Publication', function() {

  // Clear publication collection after each suite.
  afterEach(function(done) {
    Publication.collection.remove(function(err) { done(); });
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

  //   it('should block duplicate slugs', function(done) {

  //     // Create a new college with a duplicate slug.
  //     var dupCollege = new College({
  //       name: 'Harvard',
  //       slug: 'yale'
  //     });

  //     // Save.
  //     dupCollege.save(function(err) {

  //       // Check for error.
  //       err.code.should.eql(11000);

  //       // Check for 1 document.
  //       College.count({}, function(err, count) {
  //         count.should.eql(1);
  //         done();
  //       });

  //     });

  //   });

  // });

  // describe('virtual field "id"', function() {

  //   var college;

  //   // Stub college.
  //   beforeEach(function(done) {
  //     college = new College();
  //     college.save(function(err) { done(); });
  //   });

  //   it('should have a virtual field for "id"', function() {
  //     college.id.should.be.ok;
  //   });

  //   it('should be a string', function() {
  //     college.id.should.be.a('string');
  //   });

  // });

  // describe('states enum', function() {

  //   it('should block non-existent state abbreviations', function(done) {

  //     // Create college with non-existent state.
  //     var college = new College({
  //       name:   'Yale',
  //       slug:   'yale',
  //       state:  'NA'
  //     });

  //     // Save.
  //     college.save(function(err) {

  //       // Check for error.
  //       err.errors.state.should.be.ok;

  //       // Check for 0 documents.
  //       College.count({}, function(err, count) {
  //         count.should.eql(0);
  //         done();
  //       });

  //     });

  //   });

  //   it('should allow valid state abbreviations', function(done) {

  //     // Create college with valid state.
  //     var college = new College({
  //       name:   'Yale',
  //       slug:   'yale',
  //       state:  'CT'
  //     });

  //     // Save.
  //     college.save(function(err) {

  //       // Check for no error.
  //       assert(!err);

  //       // Check for 1 documents.
  //       College.count({}, function(err, count) {
  //         count.should.eql(1);
  //         done();
  //       });

  //     });

  //   });

  // });

  // describe('addPublication', function() {

  //   it('should push the passed publication', function(done) {

  //     // Create college.
  //     var college = new College({
  //       name:   'Yale',
  //       slug:   'yale',
  //       state:  'CT'
  //     });

  //     // Push publication.
  //     college.addPublication({
  //       name:   'The Yale Herald',
  //       slug:   'yale-herald',
  //       url:    'http://yaleherald.com'
  //     });

  //     // Save.
  //     college.save(function(err) {

  //       // Check for no error.
  //       assert(!err);

  //       // Check for 1 publication.
  //       college.publications.length.should.eql(1);
  //       done();

  //     });

  //   });

  // });

});
