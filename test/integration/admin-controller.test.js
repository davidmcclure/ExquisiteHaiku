/*
 * Integration tests for admin controller.
 */

// Module dependencies.
var vows = require('mocha');
var should = require('should');
var assert = require('assert');
var Browser = require('zombie');
var request = require('request');
var async = require('async');
var _ = require('underscore');

// Bootstrap the application.
process.env.NODE_ENV = 'testing';
var app = require('../../app');

// Models and reserved slugs.
var User = mongoose.model('User');
var Poem = mongoose.model('Poem');
var Round = mongoose.model('Round');
var _slugs = require('../../helpers/forms/_slugs');


/*
 * ----------------------------------
 * Admin controller integration tests.
 * ----------------------------------
 */


describe('Admin Controller', function() {

  var r = 'http://localhost:3000/';
  var browser, user, unstarted, running, paused, complete;

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

    // Create unstarted poem.
    unstarted = new Poem({
      slug:             'unstarted',
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

    // Create paused poem.
    paused = new Poem({
      slug:             'paused',
      user:             user.id,
      started:          true,
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
      unstarted,
      running,
      paused,
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

    // Clear out the timers hash.
    _.each(global.Oversoul.timers, function(int, id) {
      clearInterval(int);
    });
    global.Oversoul.timers = {};

    // Truncate worker.
    var remove = function(model, callback) {
      model.collection.remove(function(err) {
        callback(err, model);
      });
    };

    // Truncate.
    async.map([
      User,
      Poem,
      Round
    ], remove, function(err, models) {
      done();
    });

  });

  describe('GET /admin', function() {

    it('should redirect to /admin/poems', function(done) {

      browser.visit(r+'admin', function() {
        browser.location.pathname.should.eql('/admin/poems');
        done();
      });

    });

  });

  describe('GET /admin/poems', function() {

    beforeEach(function(done) {

      // GET /admin/poems.
      browser.visit(r+'admin/poems', function() {
        done();
      });

    });

    it('should show poems', function() {

      browser.text('tr[slug="unstarted"] td.title').should.eql('unstarted');
      browser.text('tr[slug="running"] td.title').should.eql('running');
      browser.text('tr[slug="complete"] td.title').should.eql('complete');

    });

    it('should show edit links for unstarted poems', function() {

      // Edit link for unstarted poem.
      browser.query(
        'tr[slug="unstarted"] a.edit[href="/admin/poems/edit/unstarted"]'
      ).should.be.ok;

    });

    it('should not show edit links for started poems', function() {

      // No edit links for running, paused, and complete poems.
      assert(!browser.query('tr[slug="running"] a.edit'));
      assert(!browser.query('tr[slug="paused"] a.edit'));
      assert(!browser.query('tr[slug="complete"] a.edit'));

    });

    it('should show start links for unstarted and paused poems', function() {

      // Start link for unstarted poem.
      browser.query(
        'tr[slug="unstarted"] a.start[href="/admin/poems/start/unstarted"]'
      ).should.be.ok;

      // Start link for paused poem.
      browser.query(
        'tr[slug="paused"] a.start[href="/admin/poems/start/paused"]'
      ).should.be.ok;

      // No start links for running and complete poems.
      assert(!browser.query('tr[slug="running"] a.start'));
      assert(!browser.query('tr[slug="complete"] a.start'));

    });

    it('should show stop links for running poems', function() {

      // Stop link for running poem.
      browser.query(
        'tr[slug="running"] a.stop[href="/admin/poems/stop/running"]'
      ).should.be.ok;

      // No stop links for unstarted and complete poems.
      assert(!browser.query('tr[slug="unstarted"] a.stop'));
      assert(!browser.query('tr[slug="complete"] a.stop'));

    });

    it('should not show a start or stop link for finished poems', function() {

      assert(!browser.query('tr[slug="complete"] a.start'));
      assert(!browser.query('tr[slug="complete"] a.stop'));

    });

    it('should show delete links for all poems', function() {

      // Delete link for unstarted poem.
      browser.query(
        'tr[slug="unstarted"] a.delete[href="/admin/poems/delete/unstarted"]'
      ).should.be.ok;

      // Delete link for running poem.
      browser.query(
        'tr[slug="running"] a.delete[href="/admin/poems/delete/running"]'
      ).should.be.ok;

      // Complete link for running poem.
      browser.query(
        'tr[slug="complete"] a.delete[href="/admin/poems/delete/complete"]'
      ).should.be.ok;

    });

    it('should show "unstarted" status for unstarted poems', function() {
      browser.text('tr[slug="unstarted"] td.status').should.eql('unstarted');
    });

    it('should show "running" status for running poems', function() {
      browser.text('tr[slug="running"] td.status').should.eql('running');
    });

    it('should show "paused" status for paused poems', function() {
      browser.text('tr[slug="paused"] td.status').should.eql('paused');
    });

    it('should show "complete" status for complete poems', function() {
      browser.text('tr[slug="complete"] td.status').should.eql('complete');
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

    beforeEach(function(done) {

      // GET admin/poems/new.
      browser.visit(r+'admin/poems/new', function() {
        done();
      });

    });

    describe('slug', function() {

      it('should flash error for no slug', function(done) {

        // Fill in form.
        browser.pressButton('Create', function() {

          // Check for error.
          browser.location.pathname.should.eql('/admin/poems/new');
          browser.query('span.help-inline.slug').should.be.ok;
          done();

        });

      });

      it('should flash error for dup slug', function(done) {

        // Fill in form.
        browser.fill('slug', 'unstarted');
        browser.pressButton('Create', function() {

          // Check for error.
          browser.location.pathname.should.eql('/admin/poems/new');
          browser.query('span.help-inline.slug').should.be.ok;
          done();

        });

      });

      it('should flash error for reserved slug', function(done) {

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

    describe('numeric fields', function() {

      it('should flash errors for empty fields', function(done) {

        // Fill in form.
        browser.pressButton('Create', function() {

          // Check for errors.
          browser.location.pathname.should.eql('/admin/poems/new');
          browser.query('span.help-inline.roundLength').should.be.ok;
          browser.query('span.help-inline.sliceInterval').should.be.ok;
          browser.query('span.help-inline.minSubmissions').should.be.ok;
          browser.query('span.help-inline.submissionVal').should.be.ok;
          browser.query('span.help-inline.decayLifetime').should.be.ok;
          browser.query('span.help-inline.seedCapital').should.be.ok;
          browser.query('span.help-inline.visibleWords').should.be.ok;
          done();

        });

      });

      it('should flash errors for not positive integers', function(done) {

        // Fill in form.
        browser.fill('roundLength', '-5');
        browser.fill('sliceInterval', '-5');
        browser.fill('minSubmissions', '-5');
        browser.fill('submissionVal', '-5');
        browser.fill('decayLifetime', '-5');
        browser.fill('seedCapital', '-5');
        browser.fill('visibleWords', '-5');
        browser.pressButton('Create', function() {

          // Check for errors.
          browser.location.pathname.should.eql('/admin/poems/new');
          browser.query('span.help-inline.roundLength').should.be.ok;
          browser.query('span.help-inline.sliceInterval').should.be.ok;
          browser.query('span.help-inline.minSubmissions').should.be.ok;
          browser.query('span.help-inline.submissionVal').should.be.ok;
          browser.query('span.help-inline.decayLifetime').should.be.ok;
          browser.query('span.help-inline.seedCapital').should.be.ok;
          browser.query('span.help-inline.visibleWords').should.be.ok;
          done();

        });

      });

    });

    it('should create a new poem and redirect on success', function(done) {

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

  describe('GET /admin/poems/edit/:slug', function() {

    it('should render the form', function(done) {

      // Go to poem edit page.
      browser.visit(r+'admin/poems/edit/unstarted', function() {

        // Check for form.
        browser.query('form').should.be.ok;

        // Slug input and value.
        browser.query(
          'form input[name="slug"][value="unstarted"]'
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

    it('should redirect when the poem has been started', function(done) {

      // Go to poem edit page.
      browser.visit(r+'admin/poems/edit/paused', function() {

        // Check for redirect.
        browser.location.pathname.should.eql('/admin/poems');
        done();

      });

    });

  });

  describe('POST /admin/poems/edit/:slug', function() {

    beforeEach(function(done) {

      // GET admin/poems/edit/:slug.
      browser.visit(r+'admin/poems/edit/unstarted', function() {
        done();
      });

    });

    describe('slug', function() {

      it('should flash error for no slug', function(done) {

        // Fill in form.
        browser.fill('slug', '');
        browser.pressButton('Save', function() {

          // Check for error.
          browser.location.pathname.should.eql('/admin/poems/edit/unstarted');
          browser.query('span.help-inline.slug').should.be.ok;
          done();

        });

      });

      it('should flash error for dup slug', function(done) {

        // Fill in form.
        browser.fill('slug', 'running');
        browser.pressButton('Save', function() {

          // Check for error.
          browser.location.pathname.should.eql('/admin/poems/edit/unstarted');
          browser.query('span.help-inline.slug').should.be.ok;
          done();

        });

      });

      it('should flash error for reserved slug', function(done) {

        // Fill in form.
        browser.fill('slug', _slugs.blacklist[0]);
        browser.pressButton('Save', function() {

          // Check for error.
          browser.location.pathname.should.eql('/admin/poems/edit/unstarted');
          browser.query('span.help-inline.slug').should.be.ok;
          done();

        });

      });

    });

    describe('numeric fields', function() {

      it('should flash errors for empty fields', function(done) {

        // Fill in form.
        browser.fill('roundLength', '');
        browser.fill('sliceInterval', '');
        browser.fill('minSubmissions', '');
        browser.fill('submissionVal', '');
        browser.fill('decayLifetime', '');
        browser.fill('seedCapital', '');
        browser.fill('visibleWords', '');
        browser.pressButton('Save', function() {

          // Check for errors.
          browser.location.pathname.should.eql('/admin/poems/edit/unstarted');
          browser.query('span.help-inline.roundLength').should.be.ok;
          browser.query('span.help-inline.sliceInterval').should.be.ok;
          browser.query('span.help-inline.minSubmissions').should.be.ok;
          browser.query('span.help-inline.submissionVal').should.be.ok;
          browser.query('span.help-inline.decayLifetime').should.be.ok;
          browser.query('span.help-inline.seedCapital').should.be.ok;
          browser.query('span.help-inline.visibleWords').should.be.ok;
          done();

        });

      });

      it('should flash errors for not positive integers', function(done) {

        // Fill in form.
        browser.fill('roundLength', '-5');
        browser.fill('sliceInterval', '-5');
        browser.fill('minSubmissions', '-5');
        browser.fill('submissionVal', '-5');
        browser.fill('decayLifetime', '-5');
        browser.fill('seedCapital', '-5');
        browser.fill('visibleWords', '-5');
        browser.pressButton('Save', function() {

          // Check for errors.
          browser.location.pathname.should.eql('/admin/poems/edit/unstarted');
          browser.query('span.help-inline.roundLength').should.be.ok;
          browser.query('span.help-inline.sliceInterval').should.be.ok;
          browser.query('span.help-inline.minSubmissions').should.be.ok;
          browser.query('span.help-inline.submissionVal').should.be.ok;
          browser.query('span.help-inline.decayLifetime').should.be.ok;
          browser.query('span.help-inline.seedCapital').should.be.ok;
          browser.query('span.help-inline.visibleWords').should.be.ok;
          done();

        });

      });

    });

    it('should edit the poem and redirect on success', function(done) {

      // Fill in form.
      browser.fill('slug', 'new');
      browser.fill('roundLength', 20000);
      browser.fill('sliceInterval', 2000);
      browser.fill('minSubmissions', 20);
      browser.fill('submissionVal', 200);
      browser.fill('decayLifetime', 100);
      browser.fill('seedCapital', 2000);
      browser.fill('visibleWords', 1000);
      browser.pressButton('Save', function() {

        // Check for redirect.
        browser.location.pathname.should.eql('/admin/poems');

        // Get poem.
        Poem.findOne({ slug: 'new' }, function(err, poem) {
          poem.should.be.ok;
          poem.slug.should.eql('new');
          poem.roundLength.valueOf().should.eql(20000);
          poem.sliceInterval.valueOf().should.eql(2000);
          poem.minSubmissions.valueOf().should.eql(20);
          poem.submissionVal.valueOf().should.eql(200);
          poem.decayLifetime.valueOf().should.eql(100);
          poem.seedCapital.valueOf().should.eql(2000);
          poem.visibleWords.valueOf().should.eql(1000);
          done();
        });

      });

    });

  });

  describe('GET /admin/poems/delete/:slug', function() {

    it('should show the confirmation form', function(done) {

      // GET admin/poems/delete/:slug.
      browser.visit(r+'admin/poems/delete/unstarted', function() {

        // Check for form and fields.
        browser.query('form').should.be.ok;
        browser.query('form button[type="submit"]').should.be.ok;
        done();

      });

    });

  });

  describe('POST /admin/poems/delete/:slug', function() {

    it('should delete the poem and redirect', function(done) {

      // Get starting poems count.
      Poem.count({}, function(err, count1) {

        // GET admin/poems/delete/:slug.
        browser.visit(r+'admin/poems/delete/unstarted', function() {

          // Click the delete button.
          browser.pressButton('form button[type="submit"]', function() {

            // Confirm count--, redirect.
            Poem.count({}, function(err, count2) {
              count2.should.eql(count1-1);
              browser.location.pathname.should.eql('/admin/poems');
              done();
            });

          });

        });

      });

    });

    describe('when the poem is running', function() {

      beforeEach(function(done) {

        // Start the poem.
        browser.visit(r+'admin/poems/start/unstarted', function() {
          done();
        });

      });

      it('should stop and remove the timer for the poem', function(done) {

        // GET admin/poems/delete/:slug.
        browser.visit(r+'admin/poems/delete/unstarted', function() {

          // Click the delete button.
          browser.pressButton('form button[type="submit"]', function() {
            global.Oversoul.timers.should.not.have.keys(unstarted.id);
            done();
          });

        });

      });

    });

  });

  describe('GET /admin/poems/start/:slug', function() {

    it('should start the timer for the poem', function(done) {

      browser.visit(r+'admin/poems/start/unstarted', function() {
        global.Oversoul.timers.should.have.keys(unstarted.id);
        done();
      });

    });

    it('should create a starting round for the poem', function(done) {

      // Get starting rounds count.
      Round.count({}, function(err, count1) {

        // GET admin/poems/delete/:slug.
        browser.visit(r+'admin/poems/start/unstarted', function() {

          // Recount.
          Round.count({}, function(err, count2) {

            // Check count++.
            count2.should.eql(count1+1);

            // Get the round.
            Round.findOne({ poem: unstarted.id }, function(err, round) {
              round.should.be.ok;
              done();
            });

          });

        });

      });

    });

    it('should set running=true', function(done) {

      browser.visit(r+'admin/poems/start/unstarted', function() {

        // Re-get the poem.
        Poem.findOne({ slug: 'unstarted' }, function(err, poem) {
          poem.running.should.be.true;
          done();
        });

      });

    });

    it('should redirect to the index view', function(done) {

      browser.visit(r+'admin/poems/start/unstarted', function() {
        browser.location.pathname.should.eql('/admin/poems');
        done();
      });

    });

  });

  describe('GET /admin/poems/stop/:slug', function() {

    beforeEach(function(done) {

      // Start the poem.
      browser.visit(r+'admin/poems/start/unstarted', function() {
        done();
      });

    });

    it('should stop the timer for the poem', function(done) {

      // Confirm timer present at start.
      global.Oversoul.timers.should.have.keys(unstarted.id);

      browser.visit(r+'admin/poems/stop/unstarted', function() {
        global.Oversoul.timers.should.not.have.keys(unstarted.id);
        done();
      });

    });

    it('should set running=false', function(done) {

      browser.visit(r+'admin/poems/stop/unstarted', function() {

        // Re-get the poem.
        Poem.findOne({ slug: 'unstarted' }, function(err, poem) {
          poem.running.should.be.false;
          done();
        });

      });

    });

    it('should redirect to the index view', function(done) {

      browser.visit(r+'admin/poems/stop/unstarted', function() {
        browser.location.pathname.should.eql('/admin/poems');
        done();
      });

    });

  });

});
