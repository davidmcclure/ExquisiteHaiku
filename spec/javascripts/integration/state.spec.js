/*
 * Integration tests for state management.
 */

describe('State', function() {

  var slice, rounds;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    Ov.Controllers.Stack.Rank.delegateEvents();
  });

  beforeEach(function() {

    // Shortcut application objects.
    rounds = Ov.Controllers.Round.RoundCollection;

    // Data slice.
    slice = {
      stack: [
        ['word1', 100, 1000, 0, '1.00'],
        ['word2', 90, 0, -900, '0.50'],
        ['word3', 80, 800, 0, '0.40'],
        ['word4', 70, 0, -700, '0.30']
      ],
      syllables: 0,
      round: 'id',
      poem: [],
      clock: 10000
    };

  });

  // Clear localstorage.
  afterEach(function() {
    Ov.Controllers.Round.RoundCollection.reset();
  });

  describe('slice ingestion', function() {

    describe('state initialization', function() {

      beforeEach(function() {
        Ov.global.isVoting = null;
      });

      it('should activate submission when no round record', function() {

        // Spy on state:submit.
        var cb = jasmine.createSpy();
        Ov.vent.on('state:submit', cb);

        // Trigger slice.
        Ov.vent.trigger('socket:slice', slice);

        expect(cb).toHaveBeenCalled();
        expect(Ov.global.isVoting).toBeFalsy();

      });

      it('should activate voting when round record', function() {

        // Spy on state:vote.
        var cb = jasmine.createSpy();
        Ov.vent.on('state:vote', cb);

        // Record round submission.
        rounds.currentRound = 'id';
        rounds.recordSubmission();

        // Trigger slice.
        Ov.vent.trigger('socket:slice', slice);

        expect(cb).toHaveBeenCalled();
        expect(Ov.global.isVoting).toBeTruthy();

      });

    });

    describe('state updating', function() {

      it('should switch submit -> vote when round record', function() {

        // Set submitting.
        Ov.global.isVoting = false;

        // Spy on state:vote.
        var cb = jasmine.createSpy();
        Ov.vent.on('state:vote', cb);

        // Record round submission.
        rounds.currentRound = 'id';
        rounds.recordSubmission();

        // Trigger slice.
        Ov.vent.trigger('socket:slice', slice);

        expect(cb).toHaveBeenCalled();
        expect(Ov.global.isVoting).toBeTruthy();

      });

      it('should not re-switch submit -> vote already voting', function() {

        // Set voting.
        Ov.global.isVoting = true;

        // Spy on state:vote.
        var cb = jasmine.createSpy();
        Ov.vent.on('state:vote', cb);

        // Record round submission.
        rounds.currentRound = 'id';
        rounds.recordSubmission();

        // Trigger slice.
        Ov.vent.trigger('socket:slice', slice);

        expect(cb).not.toHaveBeenCalled();
        expect(Ov.global.isVoting).toBeTruthy();

      });

      it('should switch vote -> submit when no round record', function() {

        // Set voting.
        Ov.global.isVoting = true;

        // Spy on state:vote.
        var cb = jasmine.createSpy();
        Ov.vent.on('state:submit', cb);

        // Trigger slice.
        Ov.vent.trigger('socket:slice', slice);

        expect(cb).toHaveBeenCalled();
        expect(Ov.global.isVoting).toBeFalsy();

      });

      it('should not re-switch vote -> submit already submitting', function() {

        // Set submitting.
        Ov.global.isVoting = false;

        // Spy on state:vote.
        var cb = jasmine.createSpy();
        Ov.vent.on('state:submit', cb);

        // Trigger slice.
        Ov.vent.trigger('socket:slice', slice);

        expect(cb).not.toHaveBeenCalled();
        expect(Ov.global.isVoting).toBeFalsy();

      });

    });

  });

  describe('submit -> vote', function() {

    it('should clear the submission stack');

    it('should disable the blank');

    it('should clear the blank');

    it('should start rendering the stack');

    it('should start rendering the log');

  });

  describe('vote -> submit', function() {

    it('should clear blank');

    it('should clear stack');

    it('should clear log');

    it('should clear in-progress vote');

    it('should stop rendering stack');

    it('should stop rendering log');

    it('should enable blank');

    it('should enable word submission');

  });

});
