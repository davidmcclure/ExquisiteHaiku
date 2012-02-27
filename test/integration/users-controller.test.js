/*
 * Integration tests for user controller.
 */

// Module dependencies.
var vows = require('mocha'),
  should = require('should'),
  assert = require('assert'),
  Browser = require('zombie'),
  async = require('async');

// Bootstrap the application.
process.env.NODE_ENV = 'testing';
require('../../app');

// Models.
var User = mongoose.model('User');

/*
 * ---------------------------------
 * Use controller integration tests.
 * ---------------------------------
 */


describe('User Controller', function() {

  var r = 'http://localhost:3000/';
  var browser, user1, user2, user3;

  // Create user.
  beforeEach(function(done) {

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
      superUser:  true,
      active:     false
    });

    // Create user3.
    user3 = new User({
      username:   'rosie',
      password:   'password',
      email:      'rosie@test.com',
      admin:      true,
      superUser:  true,
      active:     false
    });

    // Save worker.
    var save = function(user, callback) {
      user.save(function(err) {
        callback(null, user);
      });
    };

    // Save.
    async.map([user1, user2, user3], save, function(err, users) {

      // Log in.
      browser.visit(r+'admin/login', function() {

        // Fill in form, submit.
        browser.fill('username', 'david');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {
          done();
        });

      });

    });

  });

  // Clear users and logout.
  afterEach(function(done) {
    User.collection.remove(function(err) {
      browser.visit(r+'admin/logout', function() { done(); });
    });
  });

  describe('GET /admin/users', function() {

    it('should block anonymous sessions', function(done) {

      // Log out.
      browser.visit(r+'admin/logout', function() {

        // Hit the route, check for redirect.
        browser.visit(r+'admin/users', function() {
          browser.location.pathname.should.eql('/admin/login');
          done();
        });

      });

    });

    it('should block non-admin users', function(done) {

      // Set user admin=false.
      user1.admin = false;
      user1.save(function(err) {

        // Hit the route, check for redirect.
        browser.visit(r+'admin/users', function() {
          browser.location.pathname.should.eql('/admin');
          done();
        });

      });

    });

    it('should block non-super users', function(done) {

      // Set user superUser=false.
      user1.superUser = false;
      user1.save(function(err) {

        // Hit the route, check for redirect.
        browser.visit(r+'admin/users', function() {
          browser.location.pathname.should.eql('/admin');
          done();
        });

      });

    });

    it('should render the users list', function(done) {

      browser.visit(r+'admin/users', function() {

        // Check for listings.
        browser.queryAll('td.title').should.have.length(3);
        browser.text('td.title').should.include('david');
        browser.text('td.title').should.include('kara');
        browser.text('td.title').should.include('rosie');
        done();

      });

    });

    it('should show edit and delete links', function(done) {

      browser.visit(r+'admin/users', function() {

        // Check for the links.
        browser.query('a[href="/admin/users/edit/david"]').should.be.ok;
        browser.query('a[href="/admin/users/edit/kara"]').should.be.ok;
        browser.query('a[href="/admin/users/delete/kara"]').should.be.ok;
        browser.query('a[href="/admin/users/edit/rosie"]').should.be.ok;
        browser.query('a[href="/admin/users/delete/rosie"]').should.be.ok;
        done();

      });

    });

    it('should not show delete link for the logged in user', function(done) {

      browser.visit(r+'admin/users', function() {

        // Confirm that there is not a delete link for the self user.
        assert(!browser.query('a[href="/admin/users/delete/david"]'));
        done();

      });

    });

  });

  describe('GET /admin/users/new', function() {

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

    it('should block non-admin users', function(done) {

      // Set user admin=false.
      user1.admin = false;
      user1.save(function(err) {

        // Hit the route, check for redirect.
        browser.visit(r+'admin/users/new', function() {
          browser.location.pathname.should.eql('/admin');
          done();
        });

      });

    });

    it('should block non-super users', function(done) {

      // Set user superUser=false.
      user1.superUser = false;
      user1.save(function(err) {

        // Hit the route, check for redirect.
        browser.visit(r+'admin/users/new', function() {
          browser.location.pathname.should.eql('/admin');
          done();
        });

      });

    });

    it('should render the form', function(done) {

      browser.visit(r+'admin/users/new', function() {

        // Check for form and fields.
        browser.query('form').should.be.ok;
        browser.query('form input[name="username"]').should.be.ok;
        browser.query('form input[name="password"]').should.be.ok;
        browser.query('form input[name="confirm"]').should.be.ok;
        browser.query('form input[name="email"]').should.be.ok;
        browser.query('form input[name="superUser"]').should.be.ok;
        browser.query('form input[name="active"]').should.be.ok;
        browser.query('form button[type="submit"]').should.be.ok;
        done();

      });

    });

  });

  describe('POST /admin/users/new', function() {

    describe('username', function() {

      it('should flash error for no username', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for taken username', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.fill('username', 'david');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for username < 4 characters', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.fill('username', 'dav');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for username > 20 characters', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.fill('username', 'srdavidwilliamcclurejr');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should not flash error when username is valid', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.fill('username', 'valid');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            assert(!browser.query('span.help-inline.username'));
            done();

          });

        });

      });

    });

    describe('password', function() {

      it('should flash error for no password', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            browser.query('span.help-inline.password').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for password < 6 characters', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.fill('password', 'pass');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            browser.query('span.help-inline.password').should.be.ok;
            done();

          });

        });

      });

      it('should not flash error when password is valid', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.fill('password', 'password');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            assert(!browser.query('span.help-inline.password'));
            done();

          });

        });

      });

    });

    describe('confirm', function() {

      it('should flash error for no confirm', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            browser.query('span.help-inline.confirm').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for mismatch', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.fill('password', 'password');
          browser.fill('confirm', 'mismatch');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            browser.query('span.help-inline.confirm').should.be.ok;
            done();

          });

        });

      });

      it('should not flash error when confirm is valid', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.fill('password', 'password');
          browser.fill('confirm', 'password');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            assert(!browser.query('span.help-inline.confirm'));
            done();

          });

        });

      });

    });

    describe('email', function() {

      it('should flash error for no email', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            browser.query('span.help-inline.email').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for taken email', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.fill('email', 'david@test.com');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            browser.query('span.help-inline.email').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for invalid email', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.fill('email', 'invalid');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            browser.query('span.help-inline.email').should.be.ok;
            done();

          });

        });

      });

      it('should not flash error when email is valid', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.fill('email', 'new@sypder.com');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/new');
            assert(!browser.query('span.help-inline.email'));
            done();

          });

        });

      });

    });

    it('should create a new user and redirect on success', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/new', function() {

          // Fill in form.
          browser.fill('username', 'valid');
          browser.fill('password', 'password');
          browser.fill('confirm', 'password');
          browser.fill('email', 'valid@test.com');
          browser.check('superUser');
          browser.check('active');
          browser.pressButton('Create', function() {

            // Check for redirect.
            browser.location.pathname.should.eql('/admin/users');

            // Get user.
            User.findOne({ username: 'valid' }, function(err, user) {
              user.should.be.ok;
              user.username.should.eql('valid');
              user.email.should.eql('valid@test.com');
              user.admin.should.be.true;
              user.superUser.should.be.true;
              user.active.should.be.true;
              done();
            });

          });

        });

      });

  });

  describe('GET /admin/users/edit/:username', function() {

    it('should block anonymous sessions', function(done) {

      // Log out.
      browser.visit(r+'admin/logout', function() {

        // Hit the route, check for redirect.
        browser.visit(r+'admin/users/edit/kara', function() {
          browser.location.pathname.should.eql('/admin/login');
          done();
        });

      });

    });

    it('should block non-admin users', function(done) {

      // Set user admin=false.
      user1.admin = false;
      user1.save(function(err) {

        // Hit the route, check for redirect.
        browser.visit(r+'admin/users/edit/kara', function() {
          browser.location.pathname.should.eql('/admin');
          done();
        });

      });

    });

    it('should block non-super users', function(done) {

      // Set user superUser=false.
      user1.superUser = false;
      user1.save(function(err) {

        // Hit the route, check for redirect.
        browser.visit(r+'admin/users/edit/kara', function() {
          browser.location.pathname.should.eql('/admin');
          done();
        });

      });

    });

    it('should render the edit information form', function(done) {

      // Go to non-self user edit page.
      browser.visit(r+'admin/users/edit/kara', function() {

        // Check for form.
        browser.query('form.edit-info').should.be.ok;

        // Username input and value.
        browser.query(
          'form.edit-info input[name="username"][value="kara"]'
        ).should.be.ok;

        // Email input and value.
        browser.query(
          'form.edit-info input[name="email"][value="kara@test.com"]'
        ).should.be.ok;

        // Super user input and value.
        browser.query(
          'form.edit-info input[name="superUser"][checked]'
        ).should.be.ok;

        // Active input and value.
        browser.query(
          'form.edit-info input[name="active"]'
        ).should.be.ok;

        // Confirm that the active checkbox is unchecked.
        assert(!browser.query(
          'form.edit-info input[name="active"][checked]'
        ));

        done();

      });

    });

    it('should not render the Super User and Active checkboxes for self edit', function(done) {

      // Go to self user edit page.
      browser.visit(r+'admin/users/edit/david', function() {

        // Check for form.
        browser.query('form.edit-info').should.be.ok;

        // Username input and value.
        browser.query(
          'form.edit-info input[name="username"][value="david"]'
        ).should.be.ok;

        // Email input and value.
        browser.query(
          'form.edit-info input[name="email"][value="david@test.com"]'
        ).should.be.ok;

        // Super user input should not be rendered.
        assert(!browser.query(
          'form.edit-info input[name="superUser"]'
        ));

        // Active input should not be rendered.
        assert(!browser.query(
          'form.edit-info input[name="active"]'
        ));

        done();

      });

    });

    it('should render the edit password form', function(done) {

      // Go to non-self user edit page.
      browser.visit(r+'admin/users/edit/kara', function() {

        // Check for form.
        browser.query('form.edit-password').should.be.ok;

        // Password input and value.
        browser.query(
          'form.edit-password input[name="password"]'
        ).should.be.ok;

        // Confirm input and value.
        browser.query(
          'form.edit-password input[name="confirm"]'
        ).should.be.ok;

        done();

      });

    });

  });

  describe('POST /admin/users/edit/:username/info', function() {

    beforeEach(function(done) {

      // Go to non-self user edit page.
      browser.visit(r+'admin/users/edit/kara', function() { done(); });

    });

    describe('username', function() {

      it('should flash error for no username', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form.
          browser.fill('username', '');
          browser.pressButton('form.edit-info button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/info');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for taken username', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form.
          browser.fill('username', 'david');
          browser.pressButton('form.edit-info button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/info');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for username < 4 characters', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form.
          browser.fill('username', 'dav');
          browser.pressButton('form.edit-info button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/info');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for username > 20 characters', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form.
          browser.fill('username', 'srdavidwilliamcclurejr');
          browser.pressButton('form.edit-info button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/info');
            browser.query('span.help-inline.username').should.be.ok;
            done();

          });

        });

      });

      it('should not flash error for self username', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form (empty email to trigger form re-show).
          browser.fill('username', 'kara');
          browser.fill('email', '');
          browser.pressButton('form.edit-info button', function() {

            // Check for no error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/info');
            assert(!browser.query('span.help-inline.username'));
            done();

          });

        });

      });

      it('should not flash error for different username', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form (empty email to trigger form re-show).
          browser.fill('username', 'different');
          browser.fill('email', '');
          browser.pressButton('form.edit-info button', function() {

            // Check for no error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/info');
            assert(!browser.query('span.help-inline.username'));
            done();

          });

        });

      });

    });

    describe('email', function() {

      it('should flash error for no email', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form.
          browser.fill('email', '');
          browser.pressButton('form.edit-info button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/info');
            browser.query('span.help-inline.email').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for invalid email', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form.
          browser.fill('email', 'invalid');
          browser.pressButton('form.edit-info button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/info');
            browser.query('span.help-inline.email').should.be.ok;
            done();

          });

        });

      });

      it('should not flash error for self email', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form (empty username to trigger form re-show).
          browser.fill('email', 'kara@test.com');
          browser.fill('username', '');
          browser.pressButton('form.edit-info button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/info');
            assert(!browser.query('span.help-inline.email'));
            done();

          });

        });

      });

      it('should not flash error for different email', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form (empty username to trigger form re-show).
          browser.fill('email', 'new@test.com');
          browser.fill('username', '');
          browser.pressButton('form.edit-info button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/info');
            assert(!browser.query('span.help-inline.email'));
            done();

          });

        });

      });

    });

    it('should correctly edit the user and redirect on success', function(done) {

      // GET admin/users.
      browser.visit(r+'admin/users/edit/kara', function() {

        // Fill in form (empty username to trigger form re-show).
        browser.fill('username', 'newusername');
        browser.fill('email', 'new@test.com');
        browser.uncheck('superUser');
        browser.check('active');
        browser.pressButton('form.edit-info button', function() {

          // Check for redirect.
          browser.location.pathname.should.eql('/admin/users');

          // Get user.
          User.findOne({ username: 'newusername' }, function(err, user) {
            user.should.be.ok;
            user.username.should.eql('newusername');
            user.email.should.eql('new@test.com');
            user.superUser.should.be.false;
            user.active.should.be.true;
            done();
          });

        });

      });

    });

  });

  describe('POST /admin/users/:username/password', function() {

    describe('password', function() {

      it('should flash error for no password', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form.
          browser.fill('password', '');
          browser.pressButton('form.edit-password button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/password');
            browser.query('span.help-inline.password').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for password < 6 characters', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form.
          browser.fill('password', 'pass');
          browser.pressButton('form.edit-password button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/password');
            browser.query('span.help-inline.password').should.be.ok;
            done();

          });

        });

      });

      it('should not flash error when password is valid', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form (empty confirm to trigger form re-show).
          browser.fill('password', 'newpassword');
          browser.fill('confirm', '');
          browser.pressButton('form.edit-password button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/password');
            assert(!browser.query('span.help-inline.password'));
            done();

          });

        });

      });

    });

    describe('confirm', function() {

      it('should flash error for no confirm', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form.
          browser.fill('confirm', '');
          browser.pressButton('form.edit-password button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/password');
            browser.query('span.help-inline.confirm').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for mismatch', function(done) {

        // GET admin/users.
        browser.visit(r+'admin/users/edit/kara', function() {

          // Fill in form.
          browser.fill('password', 'password');
          browser.fill('confirm', 'mismatch');
          browser.pressButton('form.edit-password button', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/users/edit/kara/password');
            browser.query('span.help-inline.confirm').should.be.ok;
            done();

          });

        });

      });

    });

    it('should update password and redirect on success', function(done) {

      // GET admin/users.
      browser.visit(r+'admin/users/edit/kara', function() {

        // Fill in form.
        browser.fill('password', 'newpassword');
        browser.fill('confirm', 'newpassword');
        browser.pressButton('form.edit-password button', function() {

          // Check for redirect.
          browser.location.pathname.should.eql('/admin/users');

          // Get user, check new password.
          User.findOne({ username: 'kara' }, function(err, user) {
            user.authenticate('newpassword').should.be.true;
            done();
          });

        });

      });

    });

  });

  describe('GET /admin/users/:username/delete', function() {

    it('should block anonymous sessions', function(done) {

      // Log out.
      browser.visit(r+'admin/logout', function() {

        // Hit the route, check for redirect.
        browser.visit(r+'admin/users/delete/kara', function() {
          browser.location.pathname.should.eql('/admin/login');
          done();
        });

      });

    });

    it('should block non-admin users', function(done) {

      // Set user admin=false.
      user1.admin = false;
      user1.save(function(err) {

        // Hit the route, check for redirect.
        browser.visit(r+'admin/users/delete/kara', function() {
          browser.location.pathname.should.eql('/admin');
          done();
        });

      });

    });

    it('should block non-super users', function(done) {

      // Set user superUser=false.
      user1.superUser = false;
      user1.save(function(err) {

        // Hit the route, check for redirect.
        browser.visit(r+'admin/users/delete/kara', function() {
          browser.location.pathname.should.eql('/admin');
          done();
        });

      });

    });

    it('should block self user', function(done) {

      // GET admin/users.
      browser.visit(r+'admin/users/delete/david', function() {

        // Check for redirect.
        browser.location.pathname.should.eql('/admin');
        done();

      });

    });

    it('should show the confirmation form', function(done) {

      // GET admin/users.
      browser.visit(r+'admin/users/delete/kara', function() {

        // Check for form and fields.
        browser.query('form').should.be.ok;
        browser.query('form button[type="submit"]').should.be.ok;
        done();

      });

    });

  });

  describe('POST /admin/users/delete/:username', function() {

    it('should block self user', function(done) {

      // GET admin/users.
      browser.visit(r+'admin/users/delete/david', function() {

        // Check for redirect.
        browser.location.pathname.should.eql('/admin');
        done();

      });

    });

    it('should delete the user and redirect', function(done) {

      // GET admin/users.
      browser.visit(r+'admin/users/delete/kara', function() {

        // Click confirm button.
        browser.pressButton('form button[type="submit"]', function() {

          // Try to get the  user, check for null.
          User.findOne({ username: 'kara' }, function(err, user) {
            assert(!user);
            done();
          });

        });

      });

    });

  });

});
