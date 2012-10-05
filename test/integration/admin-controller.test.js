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

      // Log in as user1.
      browser.visit(_t.root+'admin/login', function() {
        browser.fill('username', 'user1');
        browser.fill('password', 'password');
        browser.pressButton('Login', function() {
          done();
        });
      });

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

  describe('GET /admin/new', function() {

    it('should render the form', function(done) {

      browser.visit(_t.root+'admin/new', function() {

        // Check for form and fields.
        browser.query('form').should.be.ok;
        browser.query('form input[name="roundLengthValue"]').should.be.ok;
        browser.query('form input[name="roundLengthUnit"]').should.be.ok;
        browser.query('form input[name="seedCapital"]').should.be.ok;
        browser.query('form input[name="submissionVal"]').should.be.ok;
        browser.query('form input[name="decayHalflife"]').should.be.ok;
        browser.query('form input[name="published"]').should.be.ok;
        browser.query('form button[type="submit"]').should.be.ok;
        done();

      });

    });

  });

  describe('POST /admin/new', function() {

    // GET /admin/new.
    beforeEach(function(done) {
      browser.visit(_t.root+'admin/new', function() {
        done();
      });
    });

    it('should flash errors for empty fields', function(done) {

      // Empty form.
      browser.fill('roundLengthValue', '');
      browser.fill('seedCapital', '');
      browser.fill('submissionVal', '');
      browser.fill('decayHalflife', '');
      browser.pressButton('Create', function() {

        // Check for errors.
        browser.location.pathname.should.eql('/admin/new');
        browser.query('span.help-inline.roundLengthValue').should.be.ok;
        browser.query('span.help-inline.seedCapital').should.be.ok;
        browser.query('span.help-inline.submissionVal').should.be.ok;
        browser.query('span.help-inline.decayHalflife').should.be.ok;

        // Check that no poem was created.
        _t.Poem.count(function(err, count) {
          count.should.eql(5);
          done();
        });

      });

    });

    it('should flash errors for ! positive integers', function(done) {

      // Empty form.
      browser.fill('roundLengthValue', '-5');
      browser.fill('seedCapital', '-5');
      browser.fill('submissionVal', '-5');
      browser.fill('decayHalflife', '-5');
      browser.pressButton('Create', function() {

        // Check for errors.
        browser.location.pathname.should.eql('/admin/new');
        browser.query('span.help-inline.roundLengthValue').should.be.ok;
        browser.query('span.help-inline.seedCapital').should.be.ok;
        browser.query('span.help-inline.submissionVal').should.be.ok;
        browser.query('span.help-inline.decayHalflife').should.be.ok;

        // Check that no poem was created.
        _t.Poem.count(function(err, count) {
          count.should.eql(5);
          done();
        });

      });

    });

    it('should create a new poem and redirect on success', function(done) {

      _t.Poem.count(function(err, count) {

        // Empty form.
        browser.fill('roundLengthValue', '3');
        browser.fill('roundLengthUnit', 'minutes');
        browser.fill('seedCapital', '18000');
        browser.fill('submissionVal', '100');
        browser.fill('decayHalflife', '20');
        browser.pressButton('Create', function() {

          // Check for redirect.
          browser.location.pathname.should.eql('/admin');

          // Get all poem, check parameters.
          _t.Poem.find()
          .sort('-created')
          .exec(function(err, poems) {
            var poem = _t._.first(poems);
            poems.length.should.eql(count+1);
            poem.roundLengthValue.should.eql(3);
            poem.roundLengthUnit.should.eql('minutes');
            poem.seedCapital.should.eql(18000);
            poem.submissionVal.should.eql(100);
            poem.decayHalflife.should.eql(20);
            done();
          });

        });

      });

    });

  });

  describe('POST /admin/start/:hash', function() {

    beforeEach(function(done) {

      // GET /admin, start unstarted.
      browser.visit(_t.root+'admin', function() {
        browser.pressButton('div.poem[hash='+unstarted.hash+
          '] form.start button', function() {
          done();
        });
      });

    });

    it('should start the timer', function() {
      global.Oversoul.timers.should.have.keys(unstarted.id);
    });

    it('should create starting round for unstarted poem', function(done) {

      // Re-get unstarted, check for round.
      _t.Poem.findById(unstarted.id, function(err, unstarted) {
        unstarted.rounds.length.should.eql(1);
        done();
      });

    });

    it('should not create new round for paused poem', function(done) {

      // Re-get paused, check for 1 round.
      _t.Poem.findById(paused.id, function(err, paused) {
        paused.rounds.length.should.eql(1);
        done();
      });

    });

    it('should set running = true', function(done) {

      // Re-get unstarted, check running.
      _t.Poem.findById(unstarted.id, function(err, unstarted) {
        unstarted.running.should.be.true;
        done();
      });

    });

    it('should redirect', function() {
      browser.location.pathname.should.eql('/admin');
    });

  });

  describe('POST /admin/stop/:hash', function() {

    beforeEach(function(done) {

      // GET /admin, start unstarted.
      browser.visit(_t.root+'admin', function() {
        browser.pressButton('form.start[hash='+unstarted.hash+
          '] button', function() {

          // Then stop unstarted.
          browser.pressButton('form.stop[hash='+unstarted.hash+
            '] button',function() {
            done();
          });

        });
      });

    });

    it('should stop the timer', function() {
      global.Oversoul.timers.should.not.have.keys(unstarted.id);
    });

    it('should set running = false', function(done) {

      // Re-get unstarted, check running.
      _t.Poem.findById(unstarted.id, function(err, poem) {
        poem.running.should.be.false;
        done();
      });

    });

    it('should redirect', function() {
      browser.location.pathname.should.eql('/admin');
    });

  });

  describe('POST /admin/delete/:hash', function() {

    describe('when the poem is not running', function() {

      beforeEach(function(done) {

        // GET /admin, delete unstarted.
        browser.visit(_t.root+'admin', function() {
          browser.pressButton('form.delete[hash='+unstarted.hash+
            '] button', function() {
              done();
          });
        });

      });

      it('should delete the poem', function(done) {

        // Check for no unstarted.
        _t.Poem.findById(unstarted.id, function(err, poem) {
          _t.assert(!poem);
          done();
        });

      });

      it('should redirect', function() {
        browser.location.pathname.should.eql('/admin');
      });

    });

    describe('when the poem is running', function() {

      beforeEach(function(done) {

        // GET /admin, start unstarted.
        browser.visit(_t.root+'admin', function() {
          browser.pressButton('form.start[hash='+unstarted.hash+
            '] button', function() {

            // Then delete unstarted.
            browser.pressButton('form.delete[hash='+unstarted.hash+
              '] button',function() {
              done();
            });

          });
        });

      });

      it('should remove the timer', function() {
        _t.assert(!global.Oversoul.timers[unstarted.id]);
      });

    });

  });

});
