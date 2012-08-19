/*
 * Integration tests for stack voting.
 */

describe('Stack Voting', function() {

  var log, blank, points;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
  });

  beforeEach(function() {

    // Shortcut views.
    log = Ov.Controllers.Log.Stack;
    blank = Ov.Controllers.Poem.Blank;
    points = Ov.Controllers.Info.Points;

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

    // Trigger slice, get rows.
    Ov.vent.trigger('socket:slice', slice);

  });

  // Clear out localstorage.
  afterEach(function() {
    Ov.Controllers.Round.RoundCollection.reset();
  });

  it('should freeze the stack on word hover');
  it('should freeze render point preview on word hover');
  it('should freeze render blank preview on word hover');
  it('should freeze render new words in overflow during hover');
  it('should merge overflow into primary on blur');
  it('should execute echo vote');
  it('should block overbudget echo vote');

});
