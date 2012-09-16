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
          browser.pressButton('LOGIN', function() {
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

  describe('GET /admin', function() {

    // Log in user1.
    beforeEach(function(done) {

      // Log in as user1.
      browser.visit(_t.root+'admin/login', function() {
        browser.fill('username', 'user1');
        browser.fill('password', 'password');
        browser.pressButton('LOGIN', function() {

          // GET /admin.
          browser.visit(_t.root+'admin', function() {
            done();
          });

        });
      });

    });

    it('should show poems', function() {

      // Check for self poems.
      browser.text('div.poem[hash='+unstarted.hash+'] a.hash').
        should.eql(unstarted.hash);
      browser.text('div.poem[hash='+running.hash+'] a.hash').
        should.eql(running.hash);
      browser.text('div.poem[hash='+paused.hash+'] a.hash').
        should.eql(paused.hash);
      browser.text('div.poem[hash='+complete.hash+'] a.hash').
        should.eql(complete.hash);

    });

    it('should not show poems owned by other users', function() {
      _t.assert(!browser.query('div.poem[hash='+user2poem.hash+']'));
    });

    it('should show start link for unstarted poems', function() {
      browser.query('div.poem[hash="'+unstarted.hash+
        '"] form.start[action="/admin/start/'+unstarted.hash+'"]'
      ).should.be.ok;
    });

    it('should show start link for paused poems', function() {
      browser.query('div.poem[hash="'+paused.hash+
        '"] form.start[action="/admin/start/'+paused.hash+'"]'
      ).should.be.ok;
    });

    it('should not show start links for running poems', function() {
      _t.assert(!browser.query('div.poem[hash="'+running.hash+
        '"] form.start'));
    });

    it('should not show start links for complete poems', function() {
      _t.assert(!browser.query('div.poem[hash="'+complete.hash+
        '"] form.start'));
    });

    it('should show stop link for running poems', function() {
      _t.assert(browser.query('div.poem[hash="'+running.hash+
        '"] form.stop'));
    });

    it('should not show start or stop links for finished poems', function() {
      _t.assert(!browser.query('div.poem[hash="'+complete.hash+
        '"] form.start'));
      _t.assert(!browser.query('div.poem[hash="'+complete.hash+
        '"] form.stop'));
    });

    it('should show delete links for all poems', function() {
      _t.assert(browser.query('div.poem[hash="'+unstarted.hash+
        '"] form.delete'));
      _t.assert(browser.query('div.poem[hash="'+running.hash+
        '"] form.delete'));
      _t.assert(browser.query('div.poem[hash="'+paused.hash+
        '"] form.delete'));
      _t.assert(browser.query('div.poem[hash="'+complete.hash+
        '"] form.delete'));
    });

  });

  describe('GET /admin/new', function() {

    // Log user in.
    beforeEach(function(done) {
      browser.visit(_t.root+'admin/login', function() {
        browser.fill('username', 'user1');
        browser.fill('password', 'password');
        browser.pressButton('LOGIN', function() {
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
      browser.visit(_t.root+'admin/login', function() {
        browser.fill('username', 'user1');
        browser.fill('password', 'password');
        browser.pressButton('LOGIN', function() {
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
      browser.fill('decayHalflife', '');
      browser.pressButton('CREATE', function() {

        // Check for errors.
        browser.location.pathname.should.eql('/admin/new');
        browser.query('span.help-inline.roundLengthValue').should.be.ok;
        browser.query('span.help-inline.seedCapital').should.be.ok;
        browser.query('span.help-inline.submissionVal').should.be.ok;
        browser.query('span.help-inline.minSubmissions').should.be.ok;
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
      browser.fill('minSubmissions', '-5');
      browser.fill('decayHalflife', '-5');
      browser.pressButton('CREATE', function() {

        // Check for errors.
        browser.location.pathname.should.eql('/admin/new');
        browser.query('span.help-inline.roundLengthValue').should.be.ok;
        browser.query('span.help-inline.seedCapital').should.be.ok;
        browser.query('span.help-inline.submissionVal').should.be.ok;
        browser.query('span.help-inline.minSubmissions').should.be.ok;
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
        browser.fill('minSubmissions', '5');
        browser.fill('decayHalflife', '20');
        browser.pressButton('CREATE', function() {

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
            poem.minSubmissions.should.eql(5);
            poem.decayHalflife.should.eql(20);
            done();
          });

        });

      });

    });

  });

  describe('POST /admin/start/:hash', function() {

    it('should start the timer');

    it('should create starting round for unstarted poem');

    it('should not create new round for paused poem');

    it('should set running = true');

    it('should redirect');

  });

  describe('POST /admin/stop/:hash', function() {

    it('should stop the timer');

    it('should set running = false');

    it('should redirect');

  });

  describe('POST /admin/delete/:hash', function() {

    it('should delete the poem and redirect');

    describe('when the poem is running', function() {

      it('should stop the poem and remove the timer');

    });

  });

});
