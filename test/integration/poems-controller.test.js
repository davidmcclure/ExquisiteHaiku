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
  var browser, user;

  // Create documents.
  beforeEach(function(done) {

    // Create browser.
    browser = new Browser();

    // Create admin user.
    user = new User({
      username:   'david',
      password:   'password',
      email:      'david@test.com',
      admin:      true
    });

    user.save(function(err) { done(); });

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

    var idle, running, complete;

    beforeEach(function(done) {

      // Create idle poem.
      idle = new Poem({
        slug:             'idle',
        user:             user.id,
        started:          false,
        running:          false,
        complete:         false,
        roundLength :     10000,
        sliceInterval :   3,
        minSubmissions :  5,
        submissionVal :   100,
        decayLifetime :   50,
        seedCapital :     1000
      });

      // Create running poem.
      running = new Poem({
        slug:             'running',
        user:             user.id,
        started:          true,
        running:          true,
        complete:         false,
        roundLength :     10000,
        sliceInterval :   3,
        minSubmissions :  5,
        submissionVal :   100,
        decayLifetime :   50,
        seedCapital :     1000
      });

      // Create complete poem.
      complete = new Poem({
        slug:             'complete',
        user:             user.id,
        started:          true,
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
        idle,
        running,
        complete
      ], save, function(err, documents) {

        // Login as an admin user.
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

    describe('authorization', function() {

      it('should block anonymous sessions', function(done) {

        // Logout.
        browser.visit(r+'admin/logout', function() {

          // Hit the route, check for redirect.
          browser.visit(r+'admin/poems', function() {
            browser.location.pathname.should.eql('/admin/login');
            done();
          });

        });

      });

      it('should block non-admin users');

    });

    it('should show edit links for idle poems');

    it('should show delete links for all poems');

    it('should show all poems by default', function(done) {

      browser.visit(r+'admin/poems', function() {
        browser.text('td.title').should.include('idle');
        browser.text('td.title').should.include('running');
        browser.text('td.title').should.include('complete');
        done();
      });

    });

    it('should show all poems when "all" filter is active', function(done) {

      browser.visit(r+'admin/poems?filter=all', function() {
        browser.text('td.title').should.include('idle');
        browser.text('td.title').should.include('running');
        browser.text('td.title').should.include('complete');
        done();
      });

    });

    it('should show idle poems when "idle" filter is active', function(done) {

      browser.visit(r+'admin/poems?filter=idle', function() {
        browser.text('td.title').should.include('idle');
        browser.text('td.title').should.not.include('running');
        browser.text('td.title').should.not.include('complete');
        done();
      });

    });

    it('should show running poems when "running" filter is active', function(done) {

      browser.visit(r+'admin/poems?filter=running', function() {
        browser.text('td.title').should.not.include('idle');
        browser.text('td.title').should.include('running');
        browser.text('td.title').should.not.include('complete');
        done();
      });

    });

    it('should show complete poems when "done" filter is active', function(done) {

      browser.visit(r+'admin/poems?filter=done', function() {
        browser.text('td.title').should.not.include('idle');
        browser.text('td.title').should.not.include('running');
        browser.text('td.title').should.include('complete');
        done();
      });

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

      describe('authorization', function() {

        it('should block anonymous sessions', function(done) {

          // Logout.
          browser.visit(r+'admin/logout', function() {

            // Hit the route, check for redirect.
            browser.visit(r+'admin/poems', function() {
              browser.location.pathname.should.eql('/admin/login');
              done();
            });

          });

        });

        it('should block non-admin users');

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

    describe('authorization', function() {

      it('should block anonymous sessions');

    });

    describe('slug', function() {

      var poem;

      beforeEach(function(done) {

        // Create poem.
        poem = new Poem({
          slug:             'slug',
          user:             user.id,
          started:          false,
          running:          false,
          complete:         false,
          roundLength :     10000,
          sliceInterval :   3,
          minSubmissions :  5,
          submissionVal :   100,
          decayLifetime :   50,
          seedCapital :     1000
        });

        poem.save(function(err) { done(); });

      });

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

      it('should flash error for dup slug', function(done) {

        // GET admin/new.
        browser.visit(r+'admin/poems/new', function() {

          // Fill in form.
          browser.fill('slug', 'slug');
          browser.pressButton('Create', function() {

            // Check for error.
            browser.location.pathname.should.eql('/admin/poems/new');
            browser.query('span.help-inline.slug').should.be.ok;
            done();

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

  describe('GET /admin/poems/edit/:slug', function() {

    describe('authorization', function() {

      it('should block anonymous sessions');

      it('should block non-admins');

    });

    it('should block if the poem has been started');

    it('should render the form');

  });

  describe('POST /admin/poems/edit/:slug', function() {

  });

  describe('GET /admin/poems/delete/:slug', function() {

    describe('authorization', function() {

      it('should block anonymous sessions');

      it('should block non-admins');

    });

    it('should show the confirmation form');

  });

  describe('POST /admin/poems/delete/:slug', function() {

    describe('authorization', function() {

      it('should block anonymous sessions');

    });

    it('should delete the poem and redirect');

  });

  describe('POST /admin/poems/start/:slug', function() {

    describe('authorization', function() {

      it('should block anonymous sessions');

    });

    it('should start the poem');

  });

  describe('POST /admin/poems/stop/:slug', function() {

    describe('authorization', function() {

      it('should block anonymous sessions');

    });

    it('should stop the poem');

  });

});
