/*
 * Integration tests for stack rendering.
 */

describe('Stack', function() {

  var stack, slice;

  // Get fixtures, run app.
  beforeEach(function() {
    loadFixtures('index.html');
    loadFixtures('templates.html');
    Ov.start();
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
      stack: [],
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

  it('should render words', function() {

    // Mock stack data.
    slice.stack = [
      ['word1', 100, 50, -51, '1.00'],
      ['word2', 99, 40, -41, '0.99']
    ];

    // Trigger slice.
    Ov.vent.trigger('socket:slice', slice);

    // Get word rows.
    var rows = stack.$el.find('div.stack-row');
    expect(rows.length).toEqual(2);

    // Word1.
    expect($(rows[0]).find('.ratio').text()).toEqual('1.00');
    expect($(rows[0]).find('.word').text()).toEqual('word1');
    expect($(rows[0]).find('.churn.pos').text()).toEqual('50');
    expect($(rows[0]).find('.churn.neg').text()).toEqual('51');

    // Word2.
    expect($(rows[1]).find('.ratio').text()).toEqual('0.99');
    expect($(rows[1]).find('.word').text()).toEqual('word1');
    expect($(rows[1]).find('.churn.pos').text()).toEqual('40');
    expect($(rows[1]).find('.churn.neg').text()).toEqual('41');

  });

  it('should update existing words');

  it('should add new words');

});
