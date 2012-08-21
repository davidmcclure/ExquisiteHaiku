/*
 * Integration tests for state management.
 */

describe('State', function() {

  var poem, blank, stack, log, slice, e;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    Ov.Controllers.Stack.Rank.delegateEvents();
  });

  beforeEach(function() {

    // Shortcut views.
    poem = Ov.Controllers.Poem.Poem;
    blank = Ov.Controllers.Poem.Blank;
    stack = Ov.Controllers.Stack.Rank;
    log = Ov.Controllers.Log.Stack;

    // Mock keypress.
    e = $.Event('keyup');

  });

  // Clear localstorage.
  afterEach(function() {
    Ov.Controllers.Round.RoundCollection.reset();
  });

  describe('submit -> vote', function() {

    beforeEach(function() {

      // Activate voting. 
      blank.activateVote();

      // Set minSubmissions.
      Poem.minSubmissions = 3;

      slice = {
        stack: [],
        syllables: 0,
        round: 'id',
        poem: [],
        clock: 10000
      };

      // // Incoming data slice.
      Ov.vent.trigger('socket:slice', slice);

      // Add words to stack.
      e.keyCode = 13;
      blank.$el.val('valid1');
      blank.$el.trigger(e);
      blank.$el.val('valid2');
      blank.$el.trigger(e);
      blank.$el.val('valid3');
      blank.$el.trigger(e);

    });

    it('should clear the submission stack');

    it('should disable the blank', function() {

      // Trigger submit.
      e.keyCode = 17;
      blank.$el.trigger(e);

      // Trigger slice.
      Ov.vent.trigger('socket:slice', slice);

      // Check for empty stack
      expect(blank.$el).toBeDisabled();

    });

    it('should clear the blank', function() {

      // Trigger submit.
      e.keyCode = 17;
      blank.$el.val('word');
      blank.$el.trigger(e);

      // Trigger slice.
      Ov.vent.trigger('socket:slice', slice);

      // Check for empty stack
      expect(blank.$el.val()).toEqual('');

    });

    it('should start rendering the stack', function() {

      // Trigger submit.
      e.keyCode = 17;
      blank.$el.trigger(e);

      // Mock stack.
      slice.stack = [
        ['word1', 100, 50, -51, '1.00'],
        ['word2', 99, 40, -41, '0.99']
      ];

      // Trigger slice.
      Ov.vent.trigger('socket:slice', slice);

      // Get word rows.
      var rows = stack.$el.find('div.stack-row');
      expect(rows.length).toEqual(2);

    });

    it('should start rendering the log', function() {

      // Trigger submit.
      e.keyCode = 17;
      blank.$el.trigger(e);

      // Trigger slice.
      Ov.vent.trigger('socket:slice', slice);

      // Ingest votes.
      Ov.vent.trigger('socket:vote:in', 'word1', 100);
      Ov.vent.trigger('socket:vote:in', 'word2', 200);

      // Get word rows.
      var rows = log.primaryMarkup.find('div.log-row');
      expect(rows.length).toEqual(2);

    });

  });

  describe('vote -> submit', function() {

    var rows, word;

    beforeEach(function() {

      // Mock submission.
      Ov.Controllers.Round.RoundCollection.currentRound = 'id';
      Ov.vent.trigger('blank:submit');

      // Mock incoming data slice.
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

      // Trigger slice.
      Ov.vent.trigger('socket:slice', slice);

      // Get rows and word.
      rows = stack.$el.find('div.stack-row');
      word = $(rows[0]);

    });

    it('should clear blank', function() {

      // Trigger mouseenter.
      word.trigger('mouseenter');

      // Trigger new round.
      slice.round = 'new';
      Ov.vent.trigger('socket:slice', slice);

      // Check for no preview.
      expect(blank.$el.val()).toEqual('');

      // Trigger mouseleave.
      stack.$el.trigger('mouseleave');

    });

    it('should clear stack', function() {

      // Trigger new round.
      slice.round = 'new';
      Ov.vent.trigger('socket:slice', slice);

      // Check for words.
      expect(stack.$el).toBeEmpty();

    });

    it('should clear log', function() {

      // Ingest votes.
      Ov.vent.trigger('socket:vote:in', 'word1', 100);
      Ov.vent.trigger('socket:vote:in', 'word2', 200);

      // Trigger new round.
      slice.round = 'new';
      Ov.vent.trigger('socket:slice', slice);

      // Get word rows.
      var rows = log.primaryMarkup.find('div.log-row');
      expect(rows.length).toEqual(0);

    });

    it('should clear in-progress vote', function() {

      // Click.
      word.trigger($.Event('mousedown', {
        pageX: 0, pageY: 0
      }));

      // Drag.
      $(window).trigger($.Event('mousemove', {
        pageX: -3, pageY: -4
      }));

      // Trigger new round.
      slice.round = 'new';
      Ov.vent.trigger('socket:slice', slice);

      // Check for no drag.
      expect($('body')).not.toContain('div.drag-line');

    });

    it('should stop rendering stack');

    it('should stop rendering log', function() {

      // Trigger new round.
      slice.round = 'new';
      Ov.vent.trigger('socket:slice', slice);

      // Ingest votes.
      Ov.vent.trigger('socket:vote:in', 'word1', 100);
      Ov.vent.trigger('socket:vote:in', 'word2', 200);

      // Check for no drag.
      expect(log.primaryMarkup).toBeEmpty();

    });

    it('should enable blank', function() {

      // Trigger new round.
      slice.round = 'new';
      Ov.vent.trigger('socket:slice', slice);

      // Check for no drag.
      expect(blank.$el).not.toBeDisabled();

    });

    it('should permit word submission', function() {

      // Trigger new round.
      slice.round = 'new';
      Ov.vent.trigger('socket:slice', slice);

      // Add first word.
      e.keyCode = 13;
      blank.$el.val('valid1');
      blank.$el.trigger(e);

      // Add second word.
      blank.$el.val('valid2');
      blank.$el.trigger(e);

      // Check for word.
      var words = blank.stack.find('div.submission-word');
      expect(words.length).toEqual(2);
      expect(words[0]).toHaveText('valid2');
      expect(words[1]).toHaveText('valid1');

    });

  });

});
