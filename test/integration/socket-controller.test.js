/*
 * Integration tests for sockets controller.
 */

var _t = require('../dependencies.js');

describe('Socket Controller', function() {

  var user, poem1, poem2, client1, client2, client3;

  beforeEach(function(done) {

    // Create user.
    user = new _t.User({
      username: 'david',
      password: 'password',
      email: 'david@test.org'
    });

    // Poem parameters.
    var params = {
      user: user.id,
      roundLengthValue: 3,
      roundLengthUnit: 'minutes',
      sliceInterval: 300,
      minSubmissions: 5,
      submissionVal: 100,
      decayHalflife: 20,
      seedCapital: 1000,
      visibleWords: 500,
      words: [['it', 'little']]
    };

    // Create poems.
    poem1 = new _t.Poem(params);
    poem2 = new _t.Poem(params);

    var options = {
      transports: ['websocket'],
      'force new connection': true
    };

    // Connect client1.
    client1 = _t.io.connect(_t.root, options);
    client1.emit('join', poem1.id);

    // Connect client2.
    client2 = _t.io.connect(_t.root, options);
    client2.emit('join', poem1.id);

    // Connect client3.
    client3 = _t.io.connect(_t.root, options);
    client3.emit('join', poem2.id);

    // Create rounds on poems.
    poem1.newRound();
    poem2.newRound();

    // Save.
    _t.async.map([
      user,
      poem1,
      poem2
    ], _t.helpers.save, function(err, documents) {
      done();
    });

  });

  // Clear.
  afterEach(function(done) {

    // Empty votes tracker.
    global.Oversoul.votes = {};

    // Clear collections.
    _t.async.map([
      _t.User,
      _t.Poem,
      _t.Round,
      _t.Vote
    ], _t.helpers.remove, function(err, models) {
      done();
    });

  });

  describe('join', function() {

    it('should join the socket', function(done) {
      client1.on('join:complete', function() {
        done();
      });
    });

  });

  describe('validate', function() {

    it('should call with false for invalid word', function(done) {

      // Catch join.
      client1.on('join:complete', function() {

        // Trigger 'validate' with non-word.
        client1.emit('validate', poem1.id, 'invalidword', function(result) {
          result.should.be.false;
          done();
        });

      });

    });

    it('should call with false when word does not fit', function(done) {

      // Catch join.
      client1.on('join:complete', function() {

        // Trigger 'validate' with word with too many syllables.
        client1.emit('validate', poem1.id, 'excessive', function(result) {
          result.should.be.false;
          done();
        });

      });

    });

    it('should call with true when word fits', function(done) {

      // Catch join.
      client1.on('join:complete', function() {

        // Trigger 'validate' with valid word.
        client1.emit('validate', poem1.id, 'profits', function(result) {
          result.should.be.true;
          done();
        });

      });

    });

  });

  describe('submit', function() {

    var words = ['word1', 'word2', 'word3'];

    it('should apply the votes', function(done) {

      // Catch 'join'.
      client1.on('join:complete', function() {

        // Trigger 'submit'.
        client1.emit('submit', poem1.id, words);

        // Catch 'submit:complete'.
        client1.on('submit:complete', function() {

          // Check for votes.
          _t.Vote.find({ round: poem1.round.id }, function(err, votes) {

            // Get words array.
            var words = _t._.map(votes, function(vote) {
              return vote.word;
            });

            // Check for words.
            words.length.should.eql(3);
            words.should.include('word1');
            words.should.include('word2');
            words.should.include('word3');

            // Check for in-memory vote registrations.
            global.Oversoul.votes[poem1.round.id]['word1'].length.should.eql(1);
            global.Oversoul.votes[poem1.round.id]['word2'].length.should.eql(1);
            global.Oversoul.votes[poem1.round.id]['word3'].length.should.eql(1);
            global.Oversoul.votes[poem1.round.id]['word1'][0][0].should.eql(100);
            global.Oversoul.votes[poem1.round.id]['word2'][0][0].should.eql(100);
            global.Oversoul.votes[poem1.round.id]['word3'][0][0].should.eql(100);
            done();

          });

        });

      });

    });

    it('should echo the votes', function(done) {

      // Spy on the 'vote' event callback.
      var voteCallback1 = _t.sinon.spy();
      var voteCallback2 = _t.sinon.spy();
      var voteCallback3 = _t.sinon.spy();
      client1.on('vote', voteCallback1);
      client2.on('vote', voteCallback2);
      client3.on('vote', voteCallback3);

      // Catch 'join'.
      client1.on('join:complete', function() {

        // Trigger 'submit'.
        client1.emit('submit', poem1.id, words);

        // Catch 'submit:complete'.
        client1.on('submit:complete', function() {

          // Wait for echo callbacks to execute.
          setTimeout(function() {

            // Check client1 echoes.
            voteCallback1.callCount.should.eql(3);
            _t.sinon.assert.calledWith(voteCallback1, 'word1', 100);
            _t.sinon.assert.calledWith(voteCallback1, 'word2', 100);
            _t.sinon.assert.calledWith(voteCallback1, 'word3', 100);

            // Check client2 echoes.
            voteCallback2.callCount.should.eql(3);
            _t.sinon.assert.calledWith(voteCallback2, 'word1', 100);
            _t.sinon.assert.calledWith(voteCallback2, 'word2', 100);
            _t.sinon.assert.calledWith(voteCallback2, 'word3', 100);

            // Check client3 echoes.
            voteCallback3.callCount.should.eql(0);
            done();

          }, 100);

        });

      });

    });

  });

  describe('vote', function() {

    it('should apply the vote', function(done) {

      // Catch 'join'.
      client1.on('join:complete', function() {

        // Trigger 'vote'.
        client1.emit('vote', poem1.id, 'word', 100);

        // Catch 'vote:complete'.
        client1.on('vote:complete', function() {

          // Check for votes.
          _t.Vote.find({ round: poem1.round.id }, function(err, votes) {

            // Check vote.
            votes.length.should.eql(1);
            votes[0].word.should.eql('word');
            votes[0].quantity.should.eql(100);

            // Check for in-memory vote registration.
            global.Oversoul.votes[poem1.round.id]['word'].length.should.eql(1);
            global.Oversoul.votes[poem1.round.id]['word'][0][0].should.eql(100);
            done();

          });

        });

      });

    });

    it('should echo the vote', function(done) {

      // Spy on the 'vote' event callback.
      var voteCallback1 = _t.sinon.spy();
      var voteCallback2 = _t.sinon.spy();
      var voteCallback3 = _t.sinon.spy();
      client1.on('vote', voteCallback1);
      client2.on('vote', voteCallback2);
      client3.on('vote', voteCallback3);

      // Catch 'join'.
      client1.on('join:complete', function() {

        // Trigger 'vote'.
        client1.emit('vote', poem1.id, 'word', 100);

        // Catch 'vote:complete'.
        client1.on('vote:complete', function() {

          // Wait for echo callbacks to execute.
          setTimeout(function() {
            _t.sinon.assert.calledWith(voteCallback1, 'word', 100);
            _t.sinon.assert.calledWith(voteCallback2, 'word', 100);
            voteCallback3.notCalled.should.be.true;
            done();
          }, 100);

        });

      });

    });

  });

});