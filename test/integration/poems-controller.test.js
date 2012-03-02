/*
 * Integration tests for poems controller.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  Browser = require('zombie'),
  request = require('request'),
  async = require('async');

// Bootstrap the application.
process.env.NODE_ENV = 'testing';
require('../../app');

// Models and reserved slugs.
var User = mongoose.model('User'),
  Poem = mongoose.model('Poem'),
  _slugs = require('../../helpers/forms/_slugs');

/*
 * ----------------------------------
 * Poem controller integration tests.
 * ----------------------------------
 */


describe('User Controller', function() {

  var r = 'http://localhost:3000/';
  var browser, user1, user2, user3, poem1, poem2, poem3;

  // Create documents.
  beforeEach(function(done) {

    // Create browser.
    browser = new Browser();

    // Create user1.
    user1 = new User({
      username:   'david',
      password:   'password',
      email:      'david@test.com',
      admin:      true,
      superUser:  true,
      active:     true
    });

    // Create user2.
    user2 = new User({
      username:   'kara',
      password:   'password',
      email:      'kara@test.com',
      admin:      true,
      superUser:  false,
      active:     true
    });

    // Create user3.
    user3 = new User({
      username:   'rosie',
      password:   'password',
      email:      'rosie@test.com',
      admin:      false,
      superUser:  false,
      active:     true
    });

    // Create poem1.
    poem1 = new Poem({
      slug:             'poem1',
      user:             user1.id,
      admin:            true,
      roundLength :     10000,
      sliceInterval :   3,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50,
      seedCapital :     1000
    });

    // Create poem2.
    poem2 = new Poem({
      slug:             'poem2',
      user:             user2.id,
      admin:            true,
      roundLength :     10000,
      sliceInterval :   3,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50,
      seedCapital :     1000
    });

    // Create poem3.
    poem3 = new Poem({
      slug:             'poem3',
      user:             user3.id,
      admin:            false,
      roundLength :     10000,
      sliceInterval :   3,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50,
      seedCapital :     1000
    });

    // Save worker.
    var save = function(document, callback) {
      document.save(function(err) {
        callback(null, document);
      });
    };

    // Save.
    async.map([
      user1,
      user2,
      user3,
      poem1,
      poem2,
      poem3
    ], save, function(err, documents) {
      done();
    });

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

  describe('GET /admin', function() {

    it('should block anonymous sessions', function(done) {

      // Hit the route, check for redirect.
      browser.visit(r+'admin', function() {
        browser.location.pathname.should.eql('/admin/login');
        done();
      });

    });

    it('should show all admin-owned poems for admin users', function(done) {

      // Login as an admin user.
      browser.visit(r+'admin/login', function() {

        // Fill in form, submit.
        browser.fill('username', 'david');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {

          // Check for admin poems.
          browser.text('td.title').should.include('poem1');
          browser.text('td.title').should.include('poem2');
          browser.text('td.title').should.not.include('poem3');
          done();

        });

      });

    });

    it('should show user-owned poems for non-admin users', function(done) {

      // Login as an admin user.
      browser.visit(r+'admin/login', function() {

        // Fill in form, submit.
        browser.fill('username', 'rosie');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {

          // Check for admin poems.
          browser.text('td.title').should.not.include('poem1');
          browser.text('td.title').should.not.include('poem2');
          browser.text('td.title').should.include('poem3');
          done();

        });

      });

    });

  });

  describe('GET /admin/new', function() {

    describe('admin user', function() {

      beforeEach(function(done) {

        // Log in as an admin user.
        browser.visit(r+'admin/login', function() {

          // Fill in form, submit.
          browser.fill('username', 'david');
          browser.fill('password', 'password');
          browser.pressButton('Submit', function() {
            done();
          });

        });

      });

      it('should block anonymous sessions', function(done) {

        // Log out.
        browser.visit(r+'admin/logout', function() {

          // Hit the route, check for redirect.
          browser.visit(r+'admin/users/new', function() {
            browser.location.pathname.should.eql('/admin/login');
            done();
          });

        });

      });

      it('should render the form', function(done) {

        browser.visit(r+'admin/new', function() {

          // Check for form and fields.
          browser.query('form').should.be.ok;
          browser.query('form input[name="slug"]').should.be.ok;
          browser.query('form input[name="roundLength"]').should.be.ok;
          browser.query('form input[name="sliceInterval"]').should.be.ok;
          browser.query('form input[name="minSubmissions"]').should.be.ok;
          browser.query('form input[name="submissionVal"]').should.be.ok;
          browser.query('form input[name="decayLifetime"]').should.be.ok;
          browser.query('form button[type="submit"]').should.be.ok;
          done();

        });

      });

    });

  });

  describe('POST /admin/new', function() {

    beforeEach(function(done) {

      // Log in as an admin user.
      browser.visit(r+'admin/login', function() {

        // Fill in form, submit.
        browser.fill('username', 'david');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {
          done();
        });

      });

    });

    describe('slug', function() {

      it('should flash error for no slug', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/new', function() {

          // Fill in form.
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/new');
            browser.query('span.help-inline.slug').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for dup admin slug');

      it('should flash error for dup user slug');

      it('should flash error for reserved slug');

    });

    describe('round length', function() {

      it('should flash error for no slug');

      it('should flash error for not positive integer');

    });

    describe('slicing interval', function() {

      it('should flash error for no slug');

      it('should flash error for not positive integer');

    });

    describe('min submissions', function() {

      it('should flash error for no slug');

      it('should flash error for not positive integer');

    });

    describe('submission val', function() {

      it('should flash error for no slug');

      it('should flash error for not positive integer');

    });

    describe('decay lifetime', function() {

      it('should flash error for no slug');

      it('should flash error for not positive integer');

    });

    describe('seed capital', function() {

      it('should flash error for no slug');

      it('should flash error for not positive integer');

    });

  });

  describe('GET /admin/edit/:slug', function() {

  });

  describe('POST /admin/edit/:slug', function() {

  });

  describe('GET /admin/delete/:slug', function() {

  });

  describe('POST /admin/delete/:slug', function() {

  });

  describe('GET /admin/start/:slug', function() {

  });

  describe('GET /admin/stop/:slug', function() {

  });

});
