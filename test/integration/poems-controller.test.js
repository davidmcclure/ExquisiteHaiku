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


describe('Poem Controller', function() {

  var r = 'http://localhost:3000/';
  var browser, user1, user2, user3, poem1, poem2,
    poem3, poem4, poem5, poem6, poem7;

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
      running:          false,
      complete:         false,
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
      user:             user1.id,
      admin:            true,
      running:          true,
      complete:         false,
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
      user:             user1.id,
      admin:            true,
      running:          false,
      complete:         true,
      roundLength :     10000,
      sliceInterval :   3,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50,
      seedCapital :     1000
    });

    // Create poem4.
    poem4 = new Poem({
      slug:             'poem4',
      user:             user2.id,
      admin:            true,
      running:          false,
      complete:         false,
      roundLength :     10000,
      sliceInterval :   3,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50,
      seedCapital :     1000
    });

    // Create poem5.
    poem5 = new Poem({
      slug:             'poem5',
      user:             user3.id,
      admin:            false,
      running:          false,
      complete:         false,
      roundLength :     10000,
      sliceInterval :   3,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50,
      seedCapital :     1000
    });

    // Create poem6.
    poem6 = new Poem({
      slug:             'poem6',
      user:             user3.id,
      admin:            false,
      running:          true,
      complete:         false,
      roundLength :     10000,
      sliceInterval :   3,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50,
      seedCapital :     1000
    });

    // Create poem7.
    poem7 = new Poem({
      slug:             'poem7',
      user:             user3.id,
      admin:            false,
      running:          false,
      complete:         true,
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
      poem3,
      poem4,
      poem5,
      poem6,
      poem7
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

  describe('GET /admin/poems', function() {

    it('should block anonymous sessions', function(done) {

      // Hit the route, check for redirect.
      browser.visit(r+'admin/poems', function() {
        browser.location.pathname.should.eql('/admin/login');
        done();
      });

    });

    describe('admin user', function() {

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
            browser.text('td.title').should.include('poem3');
            browser.text('td.title').should.include('poem4');
            browser.text('td.title').should.not.include('poem5');
            done();

          });

        });

      });

      it('should show all admin-owned poems for admin users when the "all" filter is active');
      it('should show all admin-owned idle poems for admin users when the "idle" filter is active');
      it('should show all admin-owned running poems for admin users when the "running" filter is active');
      it('should show all admin-owned complete poems for admin users when the "done" filter is active');

    });

    describe('public user', function() {

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
            browser.text('td.title').should.not.include('poem3');
            browser.text('td.title').should.not.include('poem4');
            browser.text('td.title').should.include('poem5');
            browser.text('td.title').should.include('poem6');
            browser.text('td.title').should.include('poem7');
            done();

          });

        });

      });

      it('should show all user-owned poems for public users when the "all" filter is active');
      it('should show all user-owned idle poems for public users when the "idle" filter is active');
      it('should show all user-owned running poems for public users when the "running" filter is active');
      it('should show all user-owned complete poems for public users when the "done" filter is active');

    });

  });

  describe('GET /admin/poems/new', function() {

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
          browser.visit(r+'admin/poems/new', function() {
            browser.location.pathname.should.eql('/admin/login');
            done();
          });

        });

      });

      it('should render the form', function(done) {

        browser.visit(r+'admin/poems/new', function() {

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

  describe('POST /admin/poems/new', function() {

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
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.slug').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for dup admin slug', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.fill('slug', 'poem1');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.slug').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for dup user slug', function(done) {

        browser = new Browser();

        // Login as a public user.
        browser.visit(r+'admin/login', function() {

          // Fill in form, submit.
          browser.fill('username', 'rosie');
          browser.fill('password', 'password');
          browser.pressButton('Submit', function() {

            // GET admin/new.
            browser.visit(r+'admin/poems/new', function() {

              // Fill in form.
              browser.fill('slug', 'poem5');
              browser.pressButton('Create', function() {

                // Check for error.
                browser.location.pathname.should.eql('/admin/poems/new');
                browser.query('span.help-inline.slug').should.be.ok;
                done();

              });

            });

          });

        });

      });

      it('should flash error for reserved slug', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.fill('slug', _slugs.blacklist[0]);
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.slug').should.be.ok;
            done();

          });

        });

      });

    });

    describe('round length', function() {

      it('should flash error for no round length', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.roundLength').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for not positive integer', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.fill('roundLength', '-5');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.roundLength').should.be.ok;
            done();

          });

        });

      });

    });

    describe('slicing interval', function() {

      it('should flash error for no slicing interval', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.sliceInterval').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for not positive integer', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.fill('sliceInterval', '-5');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.sliceInterval').should.be.ok;
            done();

          });

        });

      });

    });

    describe('min submissions', function() {

      it('should flash error for no min submissions', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.minSubmissions').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for not positive integer', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.fill('minSubmissions', '-5');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.minSubmissions').should.be.ok;
            done();

          });

        });

      });

    });

    describe('submission val', function() {

      it('should flash error for no submission val', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.submissionVal').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for not positive integer', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.fill('submissionVal', '-5');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.submissionVal').should.be.ok;
            done();

          });

        });

      });

    });

    describe('decay lifetime', function() {

      it('should flash error for no decay lifetime', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.decayLifetime').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for not positive integer', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.fill('decayLifetime', '-5');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.decayLifetime').should.be.ok;
            done();

          });

        });

      });

    });

    describe('seed capital', function() {

      it('should flash error for no seed capital', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.seedCapital').should.be.ok;
            done();

          });

        });

      });

      it('should flash error for not positive integer', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.fill('seedCapital', '-5');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.seedCapital').should.be.ok;
            done();

          });

        });

      });

    });

  });

  describe('GET /admin/poems/show/:slug', function() {

  });

  describe('GET /admin/poems/edit/:slug', function() {

  });

  describe('POST /admin/poems/edit/:slug', function() {

  });

  describe('GET /admin/poems/delete/:slug', function() {

  });

  describe('POST /admin/poems/delete/:slug', function() {

  });

  describe('GET /admin/poems/start/:slug', function() {

  });

  describe('GET /admin/poems/stop/:slug', function() {

  });

});
