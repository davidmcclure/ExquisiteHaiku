/*
 * Integration tests for auth controller.
 */

// Modules
// -------
var mocha = require('mocha');
var should = require('should');
var assert = require('assert');
var Browser = require('zombie');
var async = require('async');
var config = require('yaml-config');
var mongoose = require('mongoose');
var helpers = require('../helpers');
var _ = require('underscore');


// Models
// ------

// User.
require('../../app/models/user');
var User = mongoose.model('User');


// Config
// ------

var root = config.readConfig('test/config.yaml').root;


// Run
// ---

process.env.NODE_ENV = 'testing';
var server = require('../../app');


// Specs
// -----

describe('Auth Controller', function() {

  var browser, user;

  // Create user.
  beforeEach(function(done) {

    browser = new Browser();

    // Create a user.
    user = new User({
      username: 'david',
      password: 'password',
      email: 'david@test.org'
    });

    // Save.
    user.save(function(err) { done(); });

  });

  // Clear documents.
  afterEach(function(done) {
    User.collection.remove(function(err) {
      done();
    });
  });

  describe('GET /admin/register', function() {

    it('should render the form when there is not a user session', function(done) {

      // GET admin/register.
      browser.visit(root+'admin/register', function() {

        // Check for form and fields.
        browser.query('form.register').should.be.ok;
        browser.query('form.register input[name="username"]').should.be.ok;
        browser.query('form.register input[name="password"]').should.be.ok;
        browser.query('form.register input[name="confirm"]').should.be.ok;
        browser.query('form.register button[type="submit"]').should.be.ok;
        done();

      });

    });

    it('should redirect when there is a user session', function(done) {

      // GET admin/login.
      browser.visit(root+'admin/login', function() {

        // Fill in form, submit.
        browser.fill('username', 'david');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {

          // Hit the register route as a logged-in user.
          browser.visit(root+'admin/register', function() {

            // Check for redirect.
            browser.location.pathname.should.eql('/admin');
            done();

          });

        });

      });

    });

  });

  describe('POST /admin/register', function() {

    describe('username', function() {

      it('should flash error for no username', function(done) {

        // GET admin/register.
        browser.visit(root+'admin/register', function() {

          // Fill in form.
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for username < 4 characters', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('username', 'dav');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for username > 20 characters', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('username', 'srdavidwilliamcclurejr');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for duplicate username', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('username', 'david');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should not flash an error when the username is valid', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('username', 'kara');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            assert(!browser.query('span.help-inline.username'));
            done();

          });

        });

      });

    });

    describe('email', function() {

      it('should flash error for no email', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form.
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.email').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for duplicate email', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('email', 'david@test.org');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.email').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for invalid email', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('email', 'invalid');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.email').should.be.ok;
            done();

          });

        });

      });

      it('should not flash an error when the username is valid', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('username', 'kara');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            assert(!browser.query('span.help-inline.username'));
            done();

          });

        });

      });

    });

    describe('password', function() {

      it('should flash error for no password', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form.
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.password').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for password < 6 characters', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('password', 'pass');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.password').should.be.ok;
            done();

          });

        });

      });

      it('should not flash an error when the password is valid', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('password', 'password');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            assert(!browser.query('span.help-inline.password'));
            done();

          });

        });

      });

    });

    describe('confirm', function() {

      it('should flash error for no confirmation', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form.
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.confirm').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for mismatch with password', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('password', 'password');
          browser.fill('confirm', 'mismatch');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.confirm').should.be.ok;
            done();

          });

        });

      });

      it('should not flash an error when the confirmation is valid', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('password', 'password');
          browser.fill('confirm', 'password');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            assert(!browser.query('span.help-inline.confirm'));
            done();

          });

        });

      });

    });

    describe('success', function() {

      it('should create a new user and redirect for valid form', function(done) {

        // GET admin/install.
        browser.visit(root+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('username', 'kara');
          browser.fill('email', 'kara@test.org');
          browser.fill('password', 'password');
          browser.fill('confirm', 'password');
          browser.pressButton('Submit', function() {

            // Check for redirect.
            browser.location.pathname.should.eql('/admin');

            // Get user.
            User.findOne({ username: 'kara' }, function(err, user) {
              user.should.be.ok;
              user.email.should.eql('kara@test.org');
              done();
            });

          });

        });

      });

    });

  });

  describe('GET /admin/login', function() {

    it('should render the form when there is not a user session', function(done) {

      // GET admin/login.
      browser.visit(root+'admin/login', function() {

        // Check for form and fields.
        browser.query('form').should.be.ok;
        browser.query('form input[name="username"]').should.be.ok;
        browser.query('form input[name="password"]').should.be.ok;
        browser.query('form button[type="submit"]').should.be.ok;
        done();

      });

    });

    it('should redirect when there is a user session', function(done) {

      // GET admin/login.
      browser.visit(root+'admin/login', function() {

        // Fill in form, submit.
        browser.fill('username', 'david');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {

          // Hit the login route as a logged-in user.
          browser.visit(root+'admin/login', function() {

            // Check for redirect.
            browser.location.pathname.should.eql('/admin');
            done();

          });

        });

      });

    });

  });

  describe('POST /admin/login', function() {

    describe('username', function() {

      it('should flash error for no username', function(done) {

        // GET admin/login.
        browser.visit(root+'admin/login', function() {

          // Fill in form.
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/login');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for non-existent username', function(done) {

        // GET admin/login.
        browser.visit(root+'admin/login', function() {

          // Fill in form, submit.
          browser.fill('username', 'kara');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/login');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should not flash an error when the username is valid', function(done) {

        // GET admin/login.
        browser.visit(root+'admin/login', function() {

          // Fill in form, submit.
          browser.fill('username', 'david');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/login');
            assert(!browser.query('span.help-inline.username'));
            done();

          });

        });

      });

    });

    describe('password', function() {

      it('should flash error for no password', function(done) {

        // GET admin/login.
        browser.visit(root+'admin/login', function() {

          // Fill in form.
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/login');
            browser.query('span.help-inline.password').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for incorrect password', function(done) {

        // GET admin/login.
        browser.visit(root+'admin/login', function() {

          // Fill in form, submit.
          browser.fill('username', 'david');
          browser.fill('password', 'incorrect');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/login');
            browser.query('span.help-inline.password').should.be.ok;
            done();

          });

        });

      });

    });

    describe('success', function() {

      it('should log in and redirect for valid form', function(done) {

        // GET admin/login.
        browser.visit(root+'admin/login', function() {

          // Fill in form, submit.
          browser.fill('username', 'david');
          browser.fill('password', 'password');
          browser.pressButton('Submit', function() {

            // Check for redirect.
            browser.location.pathname.should.eql('/admin');
            done();

          });

        });

      });

    });

  });

  describe('GET /admin/logout', function() {

    it('should log out a logged-in user', function(done) {

      // GET admin/login.
      browser.visit(root+'admin/login', function() {

        // Fill in form, submit.
        browser.fill('username', 'david');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {

          // Hit the logout route as a logged-in user.
          browser.visit(root+'admin/logout', function() {

            // Check for redirect.
            browser.location.pathname.should.eql('/admin/login');
            done();

          });

        });

      });

    });

  });

});
