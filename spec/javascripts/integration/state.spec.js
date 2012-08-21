/*
 * Integration tests for state management.
 */

describe('State', function() {

  var poem, blank, stack, log, slice;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
  });

  // Shortcut classes.
  beforeEach(function() {
    poem = Ov.Controllers.Poem.Poem;
    blank = Ov.Controllers.Poem.Blank;
    stack = Ov.Controllers.Stack.Rank;
    log = Ov.Controllers.Log.Stack;
  });

  // Clear localstorage.
  afterEach(function() {
    Ov.Controllers.Round.RoundCollection.reset();
  });

  describe('submit -> vote', function() {

    var e;

    beforeEach(function() {

      // Mock keypress.
      e = $.Event('keyup');

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

    it('should clear blank');

    it('should clear stack');

    it('should clear log');

    it('should clear in-progress vote');

    it('should stop rendering stack');

    it('should stop rendering log');

    it('should enable blank');

    it('should permit word submission');

  });

});
