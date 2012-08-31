/*
 * Integration tests for auth controller.
 */

require('../dependencies');

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
            browser.location.pathname.should.eql('/admin/poems');
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
