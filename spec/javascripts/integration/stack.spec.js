/*
 * Integration tests for stack rendering.
 */

describe('Stack', function() {

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

    // Word1.
    expect($(rows[0]).find('.ratio').text()).toEqual('1.00');
    expect($(rows[0]).find('.word').text()).toEqual('word1');
    expect($(rows[0]).find('.churn.pos').text()).toEqual('50');
    expect($(rows[0]).find('.churn.neg').text()).toEqual('51');

    // Word2.
    expect($(rows[1]).find('.ratio').text()).toEqual('0.99');
    expect($(rows[1]).find('.word').text()).toEqual('word2');
    expect($(rows[1]).find('.churn.pos').text()).toEqual('40');
    expect($(rows[1]).find('.churn.neg').text()).toEqual('41');

  });

  it('should update existing words', function() {

    // Initial stack.
    slice.stack = [
      ['word1', 100, 50, -51, '1.00'],
      ['word2', 99, 40, -41, '0.99']
    ];

    // Trigger slice.
    Ov.vent.trigger('socket:slice', slice);

    // Modified stack.
    slice.stack = [
      ['word2', 200, 60, -61, '1.00'],
      ['word1', 100, 50, -51, '0.50']
    ];

    // Trigger slice.
    Ov.vent.trigger('socket:slice', slice);

    // Get word rows.
    var rows = stack.$el.find('div.stack-row');
    expect(rows.length).toEqual(2);

    // Word2.
    expect($(rows[0]).find('.ratio').text()).toEqual('1.00');
    expect($(rows[0]).find('.word').text()).toEqual('word2');
    expect($(rows[0]).find('.churn.pos').text()).toEqual('60');
    expect($(rows[0]).find('.churn.neg').text()).toEqual('61');

    // Word1.
    expect($(rows[1]).find('.ratio').text()).toEqual('0.50');
    expect($(rows[1]).find('.word').text()).toEqual('word1');
    expect($(rows[1]).find('.churn.pos').text()).toEqual('50');
    expect($(rows[1]).find('.churn.neg').text()).toEqual('51');

  });

  it('should add new words', function() {

    // Mock stack.
    slice.stack = [
      ['word1', 100, 50, -51, '1.00'],
      ['word2', 99, 40, -41, '0.99']
    ];

    // Trigger slice.
    Ov.vent.trigger('socket:slice', slice);

    // New words.
    slice.stack = [
      ['word2', 200, 60, -61, '1.00'],
      ['word1', 100, 50, -51, '0.50'],
      ['word3', 90, 40, -41, '0.40'],
      ['word4', 80, 30, -31, '0.30']
    ];

    // Trigger slice.
    Ov.vent.trigger('socket:slice', slice);

    // Get word rows.
    var rows = stack.$el.find('div.stack-row');
    expect(rows.length).toEqual(4);

    // Word2.
    expect($(rows[0]).find('.ratio').text()).toEqual('1.00');
    expect($(rows[0]).find('.word').text()).toEqual('word2');
    expect($(rows[0]).find('.churn.pos').text()).toEqual('60');
    expect($(rows[0]).find('.churn.neg').text()).toEqual('61');

    // Word1.
    expect($(rows[1]).find('.ratio').text()).toEqual('0.50');
    expect($(rows[1]).find('.word').text()).toEqual('word1');
    expect($(rows[1]).find('.churn.pos').text()).toEqual('50');
    expect($(rows[1]).find('.churn.neg').text()).toEqual('51');

    // Word3.
    expect($(rows[2]).find('.ratio').text()).toEqual('0.40');
    expect($(rows[2]).find('.word').text()).toEqual('word3');
    expect($(rows[2]).find('.churn.pos').text()).toEqual('40');
    expect($(rows[2]).find('.churn.neg').text()).toEqual('41');

    // Word4.
    expect($(rows[3]).find('.ratio').text()).toEqual('0.30');
    expect($(rows[3]).find('.word').text()).toEqual('word4');
    expect($(rows[3]).find('.churn.pos').text()).toEqual('30');
    expect($(rows[3]).find('.churn.neg').text()).toEqual('31');

  });

});
