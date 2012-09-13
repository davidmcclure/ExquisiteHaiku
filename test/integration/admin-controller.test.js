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
      roundLength :     10000000,
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50000,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Create running poem.
    running = new _t.Poem({
      user:             user1.id,
      rounds:           [new Round()],
      started:          true,
      running:          true,
      complete:         false,
      roundLength :     10000000,
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50000,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Create paused poem.
    paused = new _t.Poem({
      user:             user1.id,
      rounds:           [new Round()],
      started:          true,
      running:          false,
      complete:         false,
      roundLength :     10000000,
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50000,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Create complete poem.
    complete = new _t.Poem({
      user:             user1.id,
      rounds:           [new Round()],
      started:          true,
      running:          false,
      complete:         true,
      roundLength :     10000000,
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50000,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Create user2 poem.
    user2poem = new _t.Poem({
      user:             user2.id,
      started:          false,
      running:          false,
      complete:         false,
      roundLength :     10000000,
      sliceInterval :   1000,
      minSubmissions :  5,
      submissionVal :   100,
      decayLifetime :   50000,
      seedCapital :     1000,
      visibleWords :    500
    });

    // Save.
    async.map([
      user1,
      user2,
      unstarted,
      running,
      paused,
      complete,
      user2poem
    ], _t.helpers.save, function(err, documents) {

      // Login as an admin user.
      browser.visit(root+'admin/login', function() {

        // Fill in form, submit.
        browser.fill('username', 'user1');
        browser.fill('password', 'password');
        browser.pressButton('Submit', function() {
          done();
        });

      });

    });

  });

  // Clear users and poems.
  afterEach(function(done) {

    // Clear the intervals.
    _.each(global.Oversoul.timers, function(int, id) {
      clearInterval(int);
    });

    // Clear the timer hash.
    global.Oversoul.timers = {};

    // Truncate.
    async.map([
      _t.User,
      _t.Poem
    ], _t.helpers.remove, function(err, models) {
      done();
    });

  });

  describe('GET /', function() {

    describe('for anonymous user', function() {

      it('should show login link');
      it('should shoe register link');

    });

    describe('for logged in user', function() {

      it('should not show login link');
      it('should not show register link');
      it('should show logout link');

    });

  });

  describe('GET /admin/new', function() {

    it('should render the form');

  });

  describe('POST /admin/new', function() {

    it('should flash errors for empty fields');
    it('should flash errors for ! positive integers');
    it('should create a new poem and redirect on success');

  });

});
