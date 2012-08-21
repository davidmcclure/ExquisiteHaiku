/*
 * Integration tests for state management.
 */

describe('State', function() {

  var blank, stack;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
  });

  // Shortcut classes.
  beforeEach(function() {
    blank = Ov.Controllers.Poem.Blank;
    stack = Ov.Controllers.Stack.Rank;
  });

  // Clear localstorage.
  afterEach(function() {
    Ov.Controllers.Round.RoundCollection.reset();
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

    it('should permit word submission');

  });

});
