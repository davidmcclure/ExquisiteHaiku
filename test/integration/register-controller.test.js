/*
 * Integration tests for registration controller.
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
var User = mongoose.model('User'),
  _slugs = require('../../helpers/forms/_slugs');

/*
 * --------------------------------------
 * Register controller integration tests.
 * --------------------------------------
 */


describe('Register Controller', function() {

  var browser = new Browser();
  var r = 'http://localhost:3000/';
  var user;

  beforeEach(function(done) {

    // Create user.
    user = new User({
      username:   'david',
      password:   'password',
      email:      'david@test.com',
      admin:      true,
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

  describe('GET /admin/register', function() {

    it('should render the form', function(done) {

      // Hit the register route.
      browser.visit(r+'admin/register', function() {

        // Check for form and fields.
        browser.query('form.register').should.be.ok;
        browser.query('form.register input[name="username"]').should.be.ok;
        browser.query('form.register input[name="password"]').should.be.ok;
        browser.query('form.register input[name="confirm"]').should.be.ok;
        browser.query('form.register input[name="email"]').should.be.ok;
        browser.query('form.register button[type="submit"]').should.be.ok;
        done();

      });

    });

  });

  describe('POST /admin/register', function() {

    describe('username', function() {

      it('should flash error for no username', function(done) {

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

          // Fill in form.
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for taken username', function(done) {

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

          // Fill in form.
          browser.fill('username', 'david');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for username < 4 characters', function(done) {

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

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

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

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

      it('should flash error for reserved slug', function(done) {

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('username', _slugs.blacklist[0]);
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
        browser.visit(r+'admin/register', function() {

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

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

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

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

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

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

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

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

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

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

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

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

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

    describe('email', function() {

      it('should flash error for no email', function(done) {

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

          // Fill in form.
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            browser.query('span.help-inline.email').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for invalid email', function(done) {

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

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

      it('should not flash an error when the email is valid', function(done) {

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('email', 'david@test.com');
          browser.pressButton('Submit', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/register');
            assert(!browser.query('span.help-inline.email'));
            done();

          });

        });

      });

    });

    describe('success', function() {

      it('should create a new user and redirect for valid form', function(done) {

        // GET admin/register.
        browser.visit(r+'admin/register', function() {

          // Fill in form, submit.
          browser.fill('username', 'kara');
          browser.fill('password', 'password');
          browser.fill('confirm', 'password');
          browser.fill('email', 'kara@test.com');
          browser.pressButton('Submit', function() {

            // Check for redirect.
            browser.location.pathname.should.eql('/admin/poems');

            // Get user.
            User.findOne({ username: 'kara' }, function(err, user) {
              user.should.be.ok;
              user.username.should.eql('kara');
              user.email.should.eql('kara@test.com');
              user.admin.should.be.false;
              user.superUser.should.be.false;
              user.active.should.be.true;
              done();
            });

          });

        });

      });

    });

  });

});

