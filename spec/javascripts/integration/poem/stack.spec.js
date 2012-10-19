/*
 * Integration tests for stack rendering.
 */

describe('Stack', function() {

  var slice;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    _t.loadPoem();
  });

  beforeEach(function() {

    _t.isVoting();

    // Slice.
    slice = {
      stack: [],
      syllables: 0,
      round: 'id',
      poem: [],
      clock: 10000
    };

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
    var rows = _t.rank.$el.find('div.stack-row');
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
    var rows = _t.rank.$el.find('div.stack-row');
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

  it('should not update words when frozen', function() {

    // Initial stack.
    slice.stack = [
      ['word1', 100, 50, -51, '1.00'],
      ['word2', 99, 40, -41, '0.99']
    ];

    // Trigger slice.
    Ov.vent.trigger('socket:slice', slice);

    // Should block rendering when frozen.
    // -----------------------------------

    // Trigger mouseenter on word.
    var rows = _t.rank.$el.find('div.stack-row');
    $(rows[0]).trigger('mouseenter');

    // Check for frozen class.
    expect(_t.rank.$el).toHaveClass('frozen');

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
    rows = _t.rank.$el.find('div.stack-row');
    expect(rows.length).toEqual(2);

    // Un-updated word1.
    expect($(rows[0]).find('.ratio').text()).toEqual('1.00');
    expect($(rows[0]).find('.word').text()).toEqual('word1');
    expect($(rows[0]).find('.churn.pos').text()).toEqual('50');
    expect($(rows[0]).find('.churn.neg').text()).toEqual('51');

    // Un-updated word2.
    expect($(rows[1]).find('.ratio').text()).toEqual('0.99');
    expect($(rows[1]).find('.word').text()).toEqual('word2');
    expect($(rows[1]).find('.churn.pos').text()).toEqual('40');
    expect($(rows[1]).find('.churn.neg').text()).toEqual('41');

    // Should resume rendering when un-frozen.
    // ---------------------------------------

    // Trigger mouseleave.
    $(rows[0]).trigger('mouseleave');

    // Trigger slice.
    Ov.vent.trigger('socket:slice', slice);

    // Get word rows.
    rows = _t.rank.$el.find('div.stack-row');
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
    var rows = _t.rank.$el.find('div.stack-row');
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

  it('should render word sizes and colors', function() {

    // Mock stack.
    slice.stack = [
      ['word1', 100, 1000, 0, '1.00'],
      ['word2', 90, 0, -900, '0.50'],
      ['word3', 80, 800, 0, '0.40'],
      ['word4', 70, 0, -700, '0.30']
    ];

    // Trigger slice.
    Ov.vent.trigger('socket:slice', slice);

    // Get word rows.
    var rows = _t.rank.$el.find('div.stack-row');

    // Check colors.
    expect($(rows[0]).find('.word')).toHaveClass('positive');
    expect($(rows[1]).find('.word')).toHaveClass('negative');
    expect($(rows[2]).find('.word')).toHaveClass('positive');
    expect($(rows[3]).find('.word')).toHaveClass('negative');

    // Get sizes.
    var w1size = parseInt($(rows[0]).find('.word').css('font-size'), 10);
    var w2size = parseInt($(rows[1]).find('.word').css('font-size'), 10);
    var w3size = parseInt($(rows[2]).find('.word').css('font-size'), 10);
    var w4size = parseInt($(rows[3]).find('.word').css('font-size'), 10);

    // Check sizes.
    expect(w1size).toBeGreaterThan(w2size);
    expect(w2size).toBeGreaterThan(w3size);
    expect(w3size).toBeGreaterThan(w4size);

  });

});
