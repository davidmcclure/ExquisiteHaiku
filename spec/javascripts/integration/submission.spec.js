/*
 * Integration tests for submission flow.
 */

describe('Submission', function() {

  var blank;

  // Get fixtures, run app.
  beforeEach(function() {
    loadFixtures('fixtures.html');
    Ov.start();
  });

  // Activate submit.
  beforeEach(function() {

    // Shortcut views.
    blank = Ov.Controllers.Poem.BlankView;
    blank.activateVote();

    // Mock incoming data slice.
    Ov.vent.trigger('socket:slice', {
      stack: [],
      syllables: 0,
      round: 'round_id',
      poem: [],
      clock: 10000
    });

  });

  describe('typing submissions into the blank', function() {

    var e;

    // Mock keypress event.
    beforeEach(function() {
      e = $.Event('keyup');
    });

    it('should queue a valid word', function() {

      // Set word value.
      blank.$el.val('valid1');

      // Mock enter.
      e.keyCode = 13;
      blank.$el.trigger(e);

      // Check for word.
      var words = blank.stack.find('div.submission-word');
      expect(words.length).toEqual(1);
      expect(words[0]).toHaveText('valid1');

    });

    it('should lowercase and trim a valid word', function() {

      // Set word value.
      blank.$el.val(' Valid1  ');

      // Mock enter.
      e.keyCode = 13;
      blank.$el.trigger(e);

      // Check for word.
      var words = blank.stack.find('div.submission-word');
      expect(words.length).toEqual(1);
      expect(words[0]).toHaveText('valid1');

    });

    it('should prepend new words', function() {

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

    it('should not queue an invalid word', function() {

      // Set word value.
      blank.$el.val('invalid');

      // Mock enter.
      e.keyCode = 13;
      blank.$el.trigger(e);

      // Check for word.
      expect(blank.stack).not.toContain('div.submission-word');

    });

    it('should not double-queue a word');

    it('should queue previously deleted words');

  });

});
