/*
 * Integration tests for registration controller.
 */

require('../dependencies');

describe('Register Controller', function() {

  var browser, user;

  // Create user.
  beforeEach(function(done) {

    browser = new Browser();

    // Create a user.
    user = new User({
      username: 'kara',
      password: 'password',
      email: 'kara@test.org'
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

  describe('GET /admin/install', function() {

    it('should render the form when there is not a user session', function(done) {

      // Hit the install route.
      browser.visit(root+'admin/register', function() {

        // Check for form and fields.
        browser.query('form.install').should.be.ok;
        browser.query('form.install input[name="username"]').should.be.ok;
        browser.query('form.install input[name="password"]').should.be.ok;
        browser.query('form.install input[name="confirm"]').should.be.ok;
        browser.query('form.install button[type="submit"]').should.be.ok;
        done();

      });

    });

    it('should redirect when there is a user session', function(done) {

      // GET admin/login.
      browser.visit(root+'admin/login', function() {

        // Fill in form, submit.
        browser.fill('username', 'kara');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {

          // Hit the register route as a logged-in user.
          browser.visit(root+'admin/register', function() {

            // Check for redirect.
            browser.location.pathname.should.eql('/admin/poems');
            done();

          });

        });

      });

    });

  });

  describe('POST /admin/register', function() {

    describe('username', function() {

      it('should flash error for no username', function(done) {

        // GET admin/install.
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
          browser.fill('username', 'kara');
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
          browser.fill('username', 'david');
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
          browser.fill('email', 'kara@test.org');
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
          browser.fill('username', 'david');
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
          browser.fill('username', 'david');
          browser.fill('email', 'david@test.org');
          browser.fill('password', 'password');
          browser.fill('confirm', 'password');
          browser.pressButton('Submit', function() {

            // Check for redirect.
            browser.location.pathname.should.eql('/admin/poems');

            // Get user.
            User.findOne({ username: 'david' }, function(err, user) {
              user.should.be.ok;
              user.username.should.eql('david');
              user.email.should.eql('david@test.org');
              done();
            });

          });

        });

      });

    });

  });

});

