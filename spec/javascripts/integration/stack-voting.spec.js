/*
 * Integration tests for stack voting.
 */

describe('Stack Voting', function() {

  var stack, slice;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
  });

  beforeEach(function() {

    // Shortcut blank view.
    stack = Ov.Controllers.Stack.Rank;

    // Set seedCapital.
    Poem.seedCapital = 1000;

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

  });

  // Clear out localstorage.
  afterEach(function() {
    Ov.Controllers.Round.RoundCollection.reset();
  });

  it('should render preview on hover');

  it('should render positive drag');

  it('should render negative drag');

  it('should render overbudget positive drag');

  it('should render overbudget negative drag');

  it('should execute positive vote');

  it('should execute negative vote');

  it('should block overbudget positive vote');

  it('should block overbudget negative vote');

});
