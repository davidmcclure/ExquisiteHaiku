/*
 * Integration tests for auth controller.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  Browser = require('zombie');

// Bootstrap the application.
process.env.NODE_ENV = 'testing';
require('../../app');

// Models.
var User = mongoose.model('User');

/*
 * ----------------------------------
 * Auth controller integration tests.
 * ----------------------------------
 */


describe('Auth Controller', function() {

  var r = 'http://localhost:3000/';
  var browser, user;

  // Create user.
  beforeEach(function(done) {

    browser = new Browser();

    // Create a user.
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

  // Clear users and logout.
  afterEach(function(done) {
    User.collection.remove(function(err) {
      done();
    });
  });

  describe('GET /admin/login', function() {

    it('should render the form when there is not a user session', function(done) {

      // GET admin/login.
      browser.visit(r+'admin/login', function() {

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
      browser.visit(r+'admin/login', function() {

        // Fill in form, submit.
        browser.fill('username', 'david');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {

          // Hit the login route as a logged-in user.
          browser.visit(r+'admin/login', function() {

            // Check for redirect.
            browser.location.pathname.should.eql('/admin/poems');
            done();

          });

        });

      });

    });

  });

  describe('POST /admin/install', function() {

    describe('username', function() {

      it('should flash error for no username', function(done) {

        // GET admin/login.
        browser.visit(r+'admin/login', function() {

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
        browser.visit(r+'admin/login', function() {

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

      it('should flash error for inactive username', function(done) {

        // Set user inactive.
        user.active = false;

        // Save.
        user.save(function(err) {

          // GET admin/login.
          browser.visit(r+'admin/login', function() {

            // Fill in form, submit.
            browser.fill('username', 'david');
            browser.fill('password', 'password');
            browser.pressButton('Submit', function() {

              // Check for error.
              browser.location.pathname.should.eql('/admin/login');
              browser.query('span.help-inline.username').should.be.ok;
              done();

            });

          });

        });

      });

      it('should not flash an error when the username is valid', function(done) {

        // GET admin/login.
        browser.visit(r+'admin/install', function() {

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
        browser.visit(r+'admin/login', function() {

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
        browser.visit(r+'admin/login', function() {

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
        browser.visit(r+'admin/login', function() {

          // Fill in form, submit.
          browser.fill('username', 'david');
          browser.fill('password', 'password');
          browser.pressButton('Submit', function() {

            // Check for redirect.
            browser.location.pathname.should.eql('/admin/poems');
            done();

          });

        });

      });

    });

  });

  describe('GET /admin/logout', function() {

    it('should log out a logged-in user', function(done) {

      // GET admin/login.
      browser.visit(r+'admin/login', function() {

        // Fill in form, submit.
        browser.fill('username', 'david');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {

          // Hit the logout route as a logged-in user.
          browser.visit(r+'admin/logout', function() {

            // Check for redirect.
            browser.location.pathname.should.eql('/admin/login');
            done();

          });

        });

      });

    });

  });

});

