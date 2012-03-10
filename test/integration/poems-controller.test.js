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
  var browser, user, idle, running, complete;

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

    // Create idle poem.
    idle = new Poem({
      slug:             'idle',
      user:             user.id,
      started:          false,
      running:          false,
      complete:         false,
      roundLength :     10000,
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Create running poem.
    running = new Poem({
      slug:             'running',
      user:             user.id,
      started:          true,
      running:          true,
      complete:         false,
      roundLength :     10000,
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Create complete poem.
    complete = new Poem({
      slug:             'complete',
      user:             user.id,
      started:          true,
      running:          false,
      complete:         true,
      roundLength :     10000,
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Save worker.
    var save = function(document, callback) {
      document.save(function(err) {
        callback(null, document);
      });
    };

    // Save.
    async.map([
      user,
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
          browser.query('form input[name="seedCapital"]').should.be.ok;
          browser.query('form input[name="visibleWords"]').should.be.ok;
          browser.query('form button[type="submit"]').should.be.ok;
          done();

        });

      });

    });

  });

  describe('POST /admin/poems/new', function() {

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
          seedCapital :     1000,
          visibleWords :    500
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

    it('should create a new poem and redirect on success', function(done) {

      // GET admin/poems.
      browser.visit(r+'admin/poems/new', function() {

        // Fill in form.
        browser.fill('slug', 'valid');
        browser.fill('roundLength', 10000);
        browser.fill('sliceInterval', 1000);
        browser.fill('minSubmissions', 10);
        browser.fill('submissionVal', 100);
        browser.fill('decayLifetime', 50);
        browser.fill('seedCapital', 1000);
        browser.fill('visibleWords', 500);
        browser.pressButton('Create', function() {

          // Check for redirect.
          browser.location.pathname.should.eql('/admin/poems');

          // Get poem.
          Poem.findOne({ slug: 'valid' }, function(err, poem) {
            poem.should.be.ok;
            poem.slug.should.eql('valid');
            poem.roundLength.valueOf().should.eql(10000);
            poem.sliceInterval.valueOf().should.eql(1000);
            poem.minSubmissions.valueOf().should.eql(10);
            poem.submissionVal.valueOf().should.eql(100);
            poem.decayLifetime.valueOf().should.eql(50);
            poem.seedCapital.valueOf().should.eql(1000);
            poem.visibleWords.valueOf().should.eql(500);
            done();
          });

        });

      });

    });

  });

  describe('GET /admin/poems/edit/:slug', function() {

    it('should render the form', function(done) {

      // Go to poem edit page.
      browser.visit(r+'admin/poems/edit/idle', function() {

        // Check for form.
        browser.query('form').should.be.ok;

        // Slug input and value.
        browser.query(
          'form input[name="slug"][value="idle"]'
        ).should.be.ok;

        // Round length input and value.
        browser.query(
          'form input[name="roundLength"][value="10000"]'
        ).should.be.ok;

        // Slice interval input and value.
        browser.query(
          'form input[name="sliceInterval"][value="1000"]'
        ).should.be.ok;

        // Min submission input and value.
        browser.query(
          'form input[name="minSubmissions"][value="5"]'
        ).should.be.ok;

        // Submission val input and value.
        browser.query(
          'form input[name="submissionVal"][value="100"]'
        ).should.be.ok;

        // Decay lifetime input and value.
        browser.query(
          'form input[name="decayLifetime"][value="50"]'
        ).should.be.ok;

        // Seed capital input and value.
        browser.query(
          'form input[name="seedCapital"][value="1000"]'
        ).should.be.ok;

        // Visible words input and value.
        browser.query(
          'form input[name="visibleWords"][value="500"]'
        ).should.be.ok;

        done();

      });

    });

  });

  describe('POST /admin/poems/edit/:slug', function() {

  });

  describe('GET /admin/poems/delete/:slug', function() {

    it('should show the confirmation form');

  });

  describe('POST /admin/poems/delete/:slug', function() {

    it('should delete the poem and redirect');

  });

  describe('GET /admin/poems/start/:slug', function() {

    it('should start the poem');

  });

  describe('GET /admin/poems/stop/:slug', function() {

    it('should stop the poem');

  });

});
