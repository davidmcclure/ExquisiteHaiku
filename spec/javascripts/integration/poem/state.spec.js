/*
 * Integration tests for state management.
 */

describe('State', function() {

  var slice;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    _t.loadPoem();
  });

  beforeEach(function() {

    // Stack.
    var stack = [
      ['word1', 100, 1000, 0, '1.00'],
      ['word2', 90, 0, -900, '0.50'],
      ['word3', 80, 800, 0, '0.40'],
      ['word4', 70, 0, -700, '0.30']
    ];

    // Slice.
    slice = {
      stack: stack,
      syllables: 0,
      round: 'id',
      poem: [],
      clock: 10000
    };

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
        _t.rounds.currentRound = 'id';
        _t.rounds.recordSubmission();

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
        _t.rounds.currentRound = 'id';
        _t.rounds.recordSubmission();

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
        _t.rounds.currentRound = 'id';
        _t.rounds.recordSubmission();

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

    var e, round;

    beforeEach(function() {

      // Create round.
      round = _t.rounds.create({
        id: 'id', points: 100
      });

      // Force poem render.
      _t.poem.syllables = null;
      Ov.vent.trigger('socket:slice', slice);

      // Set submitting.
      Ov.global.isVoting = false;
      Ov.vent.trigger('state:submit');
      e = $.Event('keyup');

    });

    it('should clear the submission stack', function() {

      // Submit -> vote.
      Ov.global.isVoting = true;
      Ov.vent.trigger('state:vote', round);

      // Check for detached stack.
      expect(_t.poem.$el).not.toContain(_t.blank.stack);

    });

    it('should disable the blank', function() {

      // Submit -> vote.
      Ov.global.isVoting = true;
      Ov.vent.trigger('state:vote', round);

      // Check for disabled blank.
      expect(_t.blank.$el).toBeDisabled();

    });

    it('should clear the blank', function() {

      // Submit -> vote.
      _t.blank.$el.val('word');
      Ov.global.isVoting = true;
      Ov.vent.trigger('state:vote', round);

      // Check for empty blank.
      expect(_t.blank.$el.val()).toEqual('');

    });

    it('should start rendering the stack', function() {

      // Submit -> vote.
      Ov.global.isVoting = true;
      Ov.vent.trigger('state:vote', round);

      // Trigger slice.
      Ov.vent.trigger('socket:slice', slice);

      // Get word rows.
      var rows = _t.rank.$el.find('div.stack-row');
      expect(rows.length).toEqual(4);

    });

    it('should start rendering the log', function() {

      // Submit -> vote.
      Ov.global.isVoting = true;
      Ov.vent.trigger('state:vote', round);

      // Ingest vote.
      Ov.vent.trigger('socket:vote:in', 'word', 100);

      // Get word rows.
      var rows = _t.log.primaryMarkup.find('div.log-row');
      expect(rows.length).toEqual(1);

    });

  });

  describe('vote -> submit', function() {

    var e;

    beforeEach(function() {

      // Create round.
      var round = _t.rounds.create({
        id: 'id2', points: 100
      });

      // Set voting.
      Ov.global.isVoting = true;
      Ov.vent.trigger('state:vote', round);
      e = $.Event('keyup');

    });

    it('should clear blank', function() {

      // Vote -> submit.
      _t.blank.$el.val('word');
      Ov.global.isVoting = false;
      Ov.vent.trigger('state:submit');

      // Check for empty blank.
      expect(_t.blank.$el.val()).toEqual('');

    });

    it('should clear stack', function() {

      // Render stack.
      Ov.vent.trigger('socket:slice', slice);

      // Vote -> submit.
      Ov.global.isVoting = false;
      Ov.vent.trigger('state:submit');

      // Check for empty blank.
      expect(_t.rank.$el).toBeEmpty();

    });

    it('should clear log', function() {

      // Ingest vote.
      Ov.vent.trigger('socket:vote:in', 'word', 100);

      // Vote -> submit.
      Ov.global.isVoting = false;
      Ov.vent.trigger('state:submit');

      // Check for empty blank.
      expect(_t.log.primaryMarkup).toBeEmpty();

    });

    it('should clear in-progress vote', function() {

      // Trigger slice, get rows.
      Ov.vent.trigger('socket:slice', slice);
      var rows = _t.rank.$el.find('div.stack-row');
      var word = $(rows[0]);

      // Click.
      word.trigger($.Event('mousedown', {
        pageX: 0, pageY: 0
      }));

      // Drag.
      $(window).trigger($.Event('mousemove', {
        pageX: -3, pageY: -4 
      }));

      // Vote -> submit.
      Ov.global.isVoting = false;
      Ov.vent.trigger('state:submit');

      // Check for no drag.
      expect($('body')).not.toContain('div.drag-line');

    });

    it('should stop rendering stack', function() {

      // Vote -> submit.
      Ov.global.isVoting = false;
      Ov.vent.trigger('state:submit');

      // Render stack.
      Ov.vent.trigger('socket:slice', slice);

      // Check for empty blank.
      expect(_t.rank.$el).toBeEmpty();

    });

    it('should stop rendering log', function() {

      // Vote -> submit.
      Ov.global.isVoting = false;
      Ov.vent.trigger('state:submit');

      // Ingest vote.
      Ov.vent.trigger('socket:vote:in', 'word', 100);

      // Check for empty blank.
      expect(_t.log.primaryMarkup).toBeEmpty();

    });

    it('should enable blank', function() {

      // Vote -> submit.
      Ov.global.isVoting = false;
      Ov.vent.trigger('state:submit');

      // Check for enabled blank.
      expect(_t.blank.$el).not.toBeDisabled();

    });

    it('should enable word submission', function() {

      // Vote -> submit.
      Ov.global.isVoting = false;
      Ov.vent.trigger('state:submit');

      // Force poem render.
      _t.poem.syllables = null;
      Ov.vent.trigger('socket:slice', slice);

      // Set word value.
      _t.blank.$el.val('valid1');

      // Mock enter.
      e.keyCode = 13;
      _t.blank.$el.trigger(e);

      // Check for stack and word.
      var words = _t.blank.stack.find('div.submission-word');
      expect(words.length).toEqual(1);

    });

  });

});