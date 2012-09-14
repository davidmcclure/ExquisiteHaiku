/*
 * Integration tests for admin controller.
 */

var _t = require('../dependencies.js');

describe('Admin Controller', function() {

  var browser, user1, user2, unstarted,
      running, paused, complete, user2poem;

  // Create documents.
  beforeEach(function(done) {

    // Create browser.
    browser = new _t.browser();

    // _t.User 1.
    user1 = new _t.User({
      username: 'user1',
      password: 'password',
      email: 'user1@test.org'
    });

    // _t.User 2.
    user2 = new _t.User({
      username: 'user2',
      password: 'password',
      email: 'user2@test.org'
    });

    // Create unstarted poem.
    unstarted = new _t.Poem({
      user:             user1.id,
      started:          false,
      running:          false,
      complete:         false,
      roundLengthValue: 3,
      roundLengthUnit:  'minutes',
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayHalflife :   20,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Create running poem.
    running = new _t.Poem({
      user:             user1.id,
      rounds:           [new _t.Round()],
      started:          true,
      running:          true,
      complete:         false,
      roundLengthValue: 3,
      roundLengthUnit:  'minutes',
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayHalflife :   20,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Create paused poem.
    paused = new _t.Poem({
      user:             user1.id,
      rounds:           [new _t.Round()],
      started:          true,
      running:          false,
      complete:         false,
      roundLengthValue: 3,
      roundLengthUnit:  'minutes',
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayHalflife :   20,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Create complete poem.
    complete = new _t.Poem({
      user:             user1.id,
      rounds:           [new _t.Round()],
      started:          true,
      running:          false,
      complete:         true,
      roundLengthValue: 3,
      roundLengthUnit:  'minutes',
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayHalflife :   20,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Create user2 poem.
    user2poem = new _t.Poem({
      user:             user2.id,
      started:          false,
      running:          false,
      complete:         false,
      roundLengthValue: 3,
      roundLengthUnit:  'minutes',
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayHalflife :   20,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Save.
    _t.async.map([
      user1,
      user2,
      unstarted,
      running,
      paused,
      complete,
      user2poem
    ], _t.helpers.save, function(err, documents) {
      done();
    });

  });

  // Clear users and poems.
  afterEach(function(done) {

    // Clear the intervals.
    _t._.each(global.Oversoul.timers, function(int, id) {
      clearInterval(int);
    });

    // Clear the timer hash.
    global.Oversoul.timers = {};

    // Truncate.
    _t.async.map([
      _t.User,
      _t.Poem
    ], _t.helpers.remove, function(err, models) {
      done();
    });

  });

  describe('GET /', function() {

    describe('for anonymous user', function() {

      it('should show login link', function(done) {
        browser.visit(_t.root, function() {
          browser.query('a[href="/admin/login"]').should.be.ok;
          done();
        });
      });

      it('should show register link', function(done) {
        browser.visit(_t.root, function() {
          browser.query('a[href="/admin/register"]').should.be.ok;
          done();
        });
      });

    });

    describe('for logged in user', function() {

      // Log user in.
      beforeEach(function(done) {
        browser.visit(_t.root+'admin/login', function() {
          browser.fill('username', 'user1');
          browser.fill('password', 'password');
          browser.pressButton('Submit', function() {
            done();
          });
        });
      });

      it('should not show login link', function(done) {
        browser.visit(_t.root, function() {
          _t.assert(!browser.query('a[href="/admin/login"]'));
          done();
        });
      });

      it('should not show register link', function(done) {
        browser.visit(_t.root, function() {
          _t.assert(!browser.query('a[href="/admin/register"]'));
          done();
        });
      });

      it('should show logout link', function(done) {
        browser.visit(_t.root, function() {
          browser.query('a[href="/admin/logout"]').should.be.ok;
          done();
        });
      });

    });

  });

  describe('GET /admin/new', function() {

    // Log user in.
    beforeEach(function(done) {
      browser.visit(_t.root+'admin/login', function() {
        browser.fill('username', 'user1');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {
          done();
        });
      });
    });

    it('should render the form', function(done) {

      browser.visit(_t.root+'admin/new', function() {

        // Check for form and fields.
        browser.query('form').should.be.ok;
        browser.query('form input[name="roundLengthValue"]').should.be.ok;
        browser.query('form input[name="roundLengthUnit"]').should.be.ok;
        browser.query('form input[name="seedCapital"]').should.be.ok;
        browser.query('form input[name="submissionVal"]').should.be.ok;
        browser.query('form input[name="minSubmissions"]').should.be.ok;
        browser.query('form input[name="decayLifetime"]').should.be.ok;
        browser.query('form input[name="published"]').should.be.ok;
        browser.query('form button[type="submit"]').should.be.ok;
        done();

      });

    });

  });

  describe('POST /admin/new', function() {

    // GET /admin/new.
    beforeEach(function(done) {
      browser.visit(_t.root+'admin/login', function() {
        browser.fill('username', 'user1');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {
          browser.visit(_t.root+'admin/new', function() {
            done();
          });
        });
      });
    });

    it('should flash errors for empty fields', function(done) {

      // Empty form.
      browser.fill('roundLengthValue', '');
      browser.fill('seedCapital', '');
      browser.fill('submissionVal', '');
      browser.fill('minSubmissions', '');
      browser.fill('decayLifetime', '');
      browser.pressButton('Create', function() {

        // Check for errors.
        browser.location.pathname.should.eql('/admin/new');
        browser.query('span.help-inline.roundLengthValue').should.be.ok;
        browser.query('span.help-inline.seedCapital').should.be.ok;
        browser.query('span.help-inline.submissionVal').should.be.ok;
        browser.query('span.help-inline.minSubmissions').should.be.ok;
        browser.query('span.help-inline.decayLifetime').should.be.ok;

        // Check that no poem was created.
        _t.Poem.count(function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

    it('should flash errors for ! positive integers', function(done) {

      // Empty form.
      browser.fill('roundLengthValue', '-5');
      browser.fill('seedCapital', '-5');
      browser.fill('submissionVal', '-5');
      browser.fill('minSubmissions', '-5');
      browser.fill('decayLifetime', '-5');
      browser.pressButton('Create', function() {

        // Check for errors.
        browser.location.pathname.should.eql('/admin/new');
        browser.query('span.help-inline.roundLengthValue').should.be.ok;
        browser.query('span.help-inline.seedCapital').should.be.ok;
        browser.query('span.help-inline.submissionVal').should.be.ok;
        browser.query('span.help-inline.minSubmissions').should.be.ok;
        browser.query('span.help-inline.decayLifetime').should.be.ok;

        // Check that no poem was created.
        _t.Poem.count(function(err, count) {
          count.should.eql(0);
          done();
        });

      });

    });

    it('should create a new poem and redirect on success', function(done) {

      // Empty form.
      browser.fill('roundLengthValue', '3');
      browser.fill('roundLengthUnit', 'minutes');
      browser.fill('seedCapital', '18000');
      browser.fill('submissionVal', '100');
      browser.fill('minSubmissions', '5');
      browser.fill('decayLifetime', '20');
      browser.pressButton('Create', function() {

        // Check for redirect.
        browser.location.pathname.should.eql('/admin');

        // Get all poem, check parameters.
        _t.Poem.find({}, function(err, poems) {
          poems[0].roundLengthValue.should.eql(3);
          poems[0].roundLengthUnit.should.eql('minutes');
          poems[0].seedCapital.should.eql(18000);
          poems[0].submissionVal.should.eql(100);
          poems[0].minSubmissions.should.eql(5);
          poems[0].decayLifetime.should.eql(20);
          done();
        });

      });

    });

  });

});
