/*
 * Integration tests for install controller.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  Browser = require('zombie'),
  configFile = require('yaml-config');

// Bootstrap the application.
process.env.NODE_ENV = 'testing';
require('../../app');

// Models.
var User = mongoose.model('User');

/*
 * -------------------------------------
 * Install controller integration tests.
 * -------------------------------------
 */


describe('Install Controller', function() {

  var browser = new Browser();
  var r = 'http://localhost:3000/';

  beforeEach(function() {
  });

  afterEach(function() {
  });

  describe('GET /admin/install', function() {

    it('should render the form when there are no users', function(done) {

      // Hit the install route.
      browser.visit(r+'admin/install', function() {

        // Check for form and fields.
        browser.query('form.install').should.be.ok;
        browser.query('form.install input[name="username"]').should.be.ok;
        browser.query('form.install input[name="password"]').should.be.ok;
        browser.query('form.install input[name="confirm"]').should.be.ok;
        browser.query('form.install input[name="email"]').should.be.ok;
        browser.query('form.install button[type="submit"]').should.be.ok;
        done();

      });

    });

    it('should redirect when there is an existing user', function(done) {

      // Create a user.
      var user = new User({
        username:   'david',
        password:   'password',
        email:      'david@spyder.com',
        superUser:  true,
        active:     true
      });

      // Save.
      user.save(function(err) {

        // Hit the install route.
        browser.visit(r+'admin/install', function() {

          // Check for redirect.
          browser.location.pathname.should.eql('/admin/login');
          done();

        });

      });

    });

  });

  describe('POST /admin/install', function() {

    describe('username', function() {

      it('should flash error for no username');
      it('should flash error for username < 4 characters');
      it('should flash error for username > 20 characters');

    });

    describe('password', function() {

      it('should flash error for no password');
      it('should flash error for username < 6 characters');

    });

    describe('confirm', function() {

      it('should flash error for no confirmation');
      it('should flash error for mismatch with password');

    });

    describe('email', function() {

      it('should flash error for no email');
      it('should flash error for invalid email');

    });

  });

});

