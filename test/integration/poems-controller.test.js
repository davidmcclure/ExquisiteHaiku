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
  var browser, user1, user2, user3, user4,  poem1, poem2,
  poem3, poem4, poem5, poem6, poem7, poem8, poem9, poem10;

  // Create documents.
  beforeEach(function(done) {

    // Create browser.
    browser = new Browser();

    // Create user1 -- admin super.
    user1 = new User({
      username:   'david',
      password:   'password',
      email:      'david@test.com',
      admin:      true,
      superUser:  true,
      active:     true
    });

    // Create user2 -- admin non-super.
    user2 = new User({
      username:   'kara',
      password:   'password',
      email:      'kara@test.com',
      admin:      true,
      superUser:  false,
      active:     true
    });

    // Create user3 -- public.
    user3 = new User({
      username:   'rosie',
      password:   'password',
      email:      'rosie@test.com',
      admin:      false,
      superUser:  false,
      active:     true
    });

    // Create user4 -- public.
    user4 = new User({
      username:   'wayne',
      password:   'password',
      email:      'wayne@test.com',
      admin:      false,
      superUser:  false,
      active:     true
    });

    // Create poem1 -- user1, admin, idle.
    poem1 = new Poem({
      slug:             'poem1',
      user:             user1.id,
      admin:            true,
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

    // Create poem2 -- user1, admin, running.
    poem2 = new Poem({
      slug:             'poem2',
      user:             user1.id,
      admin:            true,
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

    // Create poem3 -- user1, admin, complete.
    poem3 = new Poem({
      slug:             'poem3',
      user:             user1.id,
      admin:            true,
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

    // Create poem4 -- user2, admin, idle.
    poem4 = new Poem({
      slug:             'poem4',
      user:             user2.id,
      admin:            true,
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

    // Create poem5 -- user3, public, idle.
    poem5 = new Poem({
      slug:             'poem5',
      user:             user3.id,
      admin:            false,
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

    // Create poem6 -- user3, public, running.
    poem6 = new Poem({
      slug:             'poem6',
      user:             user3.id,
      admin:            false,
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

    // Create poem7 -- user3, public, complete.
    poem7 = new Poem({
      slug:             'poem7',
      user:             user3.id,
      admin:            false,
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

    // Create poem8 -- user4, public, idle.
    poem8 = new Poem({
      slug:             'poem8',
      user:             user4.id,
      admin:            false,
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

    // Create poem9 -- user4, public, running.
    poem9 = new Poem({
      slug:             'poem9',
      user:             user4.id,
      admin:            false,
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

    // Create poem10 -- user 4, public, complete.
    poem10 = new Poem({
      slug:             'poem10',
      user:             user4.id,
      admin:            false,
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
      user1,
      user2,
      user3,
      user4,
      poem1,
      poem2,
      poem3,
      poem4,
      poem5,
      poem6,
      poem7,
      poem8,
      poem9,
      poem10,
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

    it('should show edit links for poems that have not been started');

    it('should show delete links');

    describe('admin user', function() {

      beforeEach(function(done) {

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

      it('should show all admin-owned poems for admin users by default', function(done) {

        // Should show all self-owned poems (#1-3) and all poems owned by other
        // admin users (#4).
        browser.location.pathname.should.eql('/admin/poems');
        browser.text('td.title').should.include('poem1');
        browser.text('td.title').should.include('poem2');
        browser.text('td.title').should.include('poem3');
        browser.text('td.title').should.include('poem4');
        browser.text('td.title').should.not.include('poem5');
        browser.text('td.title').should.not.include('poem6');
        browser.text('td.title').should.not.include('poem7');
        browser.text('td.title').should.not.include('poem8');
        browser.text('td.title').should.not.include('poem9');
        browser.text('td.title').should.not.include('poem10');
        done();

      });

      it('should show admin-owned poems when the "all" filter is active', function(done) {

        // Should show all self-owned poems (#1-3) and all poems owned by other
        // admin users (#4).
        browser.visit(r+'admin/poems?filter=all', function() {
          browser.text('td.title').should.include('poem1');
          browser.text('td.title').should.include('poem2');
          browser.text('td.title').should.include('poem3');
          browser.text('td.title').should.include('poem4');
          browser.text('td.title').should.not.include('poem5');
          browser.text('td.title').should.not.include('poem6');
          browser.text('td.title').should.not.include('poem7');
          browser.text('td.title').should.not.include('poem8');
          browser.text('td.title').should.not.include('poem9');
          browser.text('td.title').should.not.include('poem10');
          done();
        });

      });

      it('should show admin-owned idle poems when the "idle" filter is active', function(done) {

        // Should show all self-owned poems (#1-3) and all poems owned by other
        // admin users (#4) that are idle (#1,3).
        browser.visit(r+'admin/poems?filter=idle', function() {
          browser.text('td.title').should.include('poem1');
          browser.text('td.title').should.not.include('poem2');
          browser.text('td.title').should.not.include('poem3');
          browser.text('td.title').should.include('poem4');
          browser.text('td.title').should.not.include('poem5');
          browser.text('td.title').should.not.include('poem6');
          browser.text('td.title').should.not.include('poem7');
          browser.text('td.title').should.not.include('poem8');
          browser.text('td.title').should.not.include('poem9');
          browser.text('td.title').should.not.include('poem10');
          done();
        });

      });

      it('should show admin-owned running poems when the "running" filter is active', function(done) {

        // Should show all self-owned poems (#1-3) and all poems owned by other
        // admin users (#4) that are running (#2).
        browser.visit(r+'admin/poems?filter=running', function() {
          browser.text('td.title').should.not.include('poem1');
          browser.text('td.title').should.include('poem2');
          browser.text('td.title').should.not.include('poem3');
          browser.text('td.title').should.not.include('poem4');
          browser.text('td.title').should.not.include('poem5');
          browser.text('td.title').should.not.include('poem6');
          browser.text('td.title').should.not.include('poem7');
          browser.text('td.title').should.not.include('poem8');
          browser.text('td.title').should.not.include('poem9');
          browser.text('td.title').should.not.include('poem10');
          done();
        });

      });

      it('should show admin-owned complete poems when the "done" filter is active', function(done) {

        // Should show all self-owned poems (#1-3) and all poems owned by other
        // admin users (#4) that are done (#3).
        browser.visit(r+'admin/poems?filter=done', function() {
          browser.text('td.title').should.not.include('poem1');
          browser.text('td.title').should.not.include('poem2');
          browser.text('td.title').should.include('poem3');
          browser.text('td.title').should.not.include('poem4');
          browser.text('td.title').should.not.include('poem5');
          browser.text('td.title').should.not.include('poem6');
          browser.text('td.title').should.not.include('poem7');
          browser.text('td.title').should.not.include('poem8');
          browser.text('td.title').should.not.include('poem9');
          browser.text('td.title').should.not.include('poem10');
          done();
        });

      });

    });

    describe('public user', function() {

      beforeEach(function(done) {

        // Login as a public user.
        browser.visit(r+'admin/login', function() {

          // Fill in form, submit.
          browser.fill('username', 'rosie');
          browser.fill('password', 'password');
          browser.pressButton('Submit', function() {
            done();
          });

        });

      });

      it('should show user-owned poems for non-admin users by default', function(done) {

        // Should show all self-owned poems (#5-7) and not any poems by non-self
        // users or admin users.
        browser.location.pathname.should.eql('/admin/poems');
        browser.text('td.title').should.not.include('poem1');
        browser.text('td.title').should.not.include('poem2');
        browser.text('td.title').should.not.include('poem3');
        browser.text('td.title').should.not.include('poem4');
        browser.text('td.title').should.include('poem5');
        browser.text('td.title').should.include('poem6');
        browser.text('td.title').should.include('poem7');
        browser.text('td.title').should.not.include('poem8');
        browser.text('td.title').should.not.include('poem9');
        browser.text('td.title').should.not.include('poem10');
        done();

      });

      it('should show user-owned poems when the "all" filter is active', function(done) {

        // Should show all self-owned poems (#5-7) and not any poems by non-self
        // users or admin users.
        browser.visit(r+'admin/poems?filter=all', function() {
          browser.text('td.title').should.not.include('poem1');
          browser.text('td.title').should.not.include('poem2');
          browser.text('td.title').should.not.include('poem3');
          browser.text('td.title').should.not.include('poem4');
          browser.text('td.title').should.include('poem5');
          browser.text('td.title').should.include('poem6');
          browser.text('td.title').should.include('poem7');
          browser.text('td.title').should.not.include('poem8');
          browser.text('td.title').should.not.include('poem9');
          browser.text('td.title').should.not.include('poem10');
          done();
        });

      });

      it('should show user-owned idle poems when the "idle" filter is active', function(done) {

        // Should show all self-owned poems (#5-7) that are idle (#5) and not any
        // poems by non-self users or admin users.
        browser.visit(r+'admin/poems?filter=idle', function() {
          browser.text('td.title').should.not.include('poem1');
          browser.text('td.title').should.not.include('poem2');
          browser.text('td.title').should.not.include('poem3');
          browser.text('td.title').should.not.include('poem4');
          browser.text('td.title').should.include('poem5');
          browser.text('td.title').should.not.include('poem6');
          browser.text('td.title').should.not.include('poem7');
          browser.text('td.title').should.not.include('poem8');
          browser.text('td.title').should.not.include('poem9');
          browser.text('td.title').should.not.include('poem10');
          done();
        });

      });

      it('should show user-owned running poems when the "running" filter is active', function(done) {

        // Should show all self-owned poems (#5-7) that are idle (#6) and not any
        // poems by non-self users or admin users.
        browser.visit(r+'admin/poems?filter=running', function() {
          browser.text('td.title').should.not.include('poem1');
          browser.text('td.title').should.not.include('poem2');
          browser.text('td.title').should.not.include('poem3');
          browser.text('td.title').should.not.include('poem4');
          browser.text('td.title').should.not.include('poem5');
          browser.text('td.title').should.include('poem6');
          browser.text('td.title').should.not.include('poem7');
          browser.text('td.title').should.not.include('poem8');
          browser.text('td.title').should.not.include('poem9');
          browser.text('td.title').should.not.include('poem10');
          done();
        });

      });

      it('should show user-owned complete poems when the "done" filter is active', function(done) {

        // Should show all self-owned poems (#5-7) that are complete (#7) and not any
        // poems by non-self users or admin users.
        browser.visit(r+'admin/poems?filter=done', function() {
          browser.text('td.title').should.not.include('poem1');
          browser.text('td.title').should.not.include('poem2');
          browser.text('td.title').should.not.include('poem3');
          browser.text('td.title').should.not.include('poem4');
          browser.text('td.title').should.not.include('poem5');
          browser.text('td.title').should.not.include('poem6');
          browser.text('td.title').should.include('poem7');
          browser.text('td.title').should.not.include('poem8');
          browser.text('td.title').should.not.include('poem9');
          browser.text('td.title').should.not.include('poem10');
          done();
        });

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

    describe('authorization', function() {

      it('should block anonymous sessions');

      it('should block admins from accessing public-user-owned poems');

      it('should block public users from accessing admin-owned poems');

      it('should block public users from accessing poems owned by other public users');

    });

    it('should show the start button when the poem is idle');

    it('should show the stop button when the poem is running');

    it('should not show a start or stop button when the poem is done');

  });

  describe('GET /admin/poems/edit/:slug', function() {

    describe('authorization', function() {

      it('should block anonymous sessions');

      it('should block admins from accessing public-user-owned poems');

      it('should block public users from accessing admin-owned poems');

      it('should block public users from accessing poems owned by other public users');

    });

    it('should block if the poem has been started');

    it('should render the form');

  });

  describe('POST /admin/poems/edit/:slug', function() {

  });

  describe('GET /admin/poems/delete/:slug', function() {

    describe('authorization', function() {

      it('should block anonymous sessions');

      it('should block admins from accessing public-user-owned poems');

      it('should block public users from accessing admin-owned poems');

      it('should block public users from accessing poems owned by other public users');

    });

    it('should show the confirmation form');

  });

  describe('POST /admin/poems/delete/:slug', function() {

    it('should block anonymous requests');

    it('should delete the poem and redirect');

  });

  describe('POST /admin/poems/start/:slug', function() {

    it('should block anonymous requests');

    it('should start the poem');

  });

  describe('POST /admin/poems/stop/:slug', function() {

    it('should block anonymous requests');

    it('should stop the poem');

  });

});
