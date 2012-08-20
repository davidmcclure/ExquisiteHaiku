/*
 * Integration tests for log voting.
 */

describe('Log Voting', function() {

  var log, blank, points;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    Ov.Controllers.Log.Stack.delegateEvents();
  });

  beforeEach(function() {

    // Shortcut views.
    log = Ov.Controllers.Log.Stack;
    blank = Ov.Controllers.Poem.Blank;
    points = Ov.Controllers.Info.Points;

    // Mock submission.
    Ov.Controllers.Round.RoundCollection.currentRound = 'id';
    Ov.vent.trigger('blank:submit');

    // Reset points.
    points.value = 1000;

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

  // Clear localstorage.
  afterEach(function() {
    Ov.Controllers.Round.RoundCollection.reset();
  });

  it('should render positive votes', function() {

    // Ingest vote.
    Ov.vent.trigger('socket:vote:in', 'word1', 100);

    // Get word rows.
    var rows = log.primaryMarkup.find('div.log-row');
    expect(rows.length).toEqual(1);

    // Check parts.
    expect($(rows[0]).find('span.value').text()).toEqual('100');
    expect($(rows[0]).find('span.word').text()).toEqual('word1');

    // Check color.
    expect($(rows[0])).toHaveClass('positive');

  });

  it('should render negative votes', function() {

    // Ingest vote.
    Ov.vent.trigger('socket:vote:in', 'word2', -100);

    // Get word rows.
    var rows = log.primaryMarkup.find('div.log-row');
    expect(rows.length).toEqual(2);

    // Check parts.
    expect($(rows[0]).find('span.value').text()).toEqual('100');
    expect($(rows[0]).find('span.word').text()).toEqual('word2');
    expect($(rows[1]).find('span.value').text()).toEqual('100');
    expect($(rows[1]).find('span.word').text()).toEqual('word1');

    // Check color.
    expect($(rows[0])).toHaveClass('negative');
    expect($(rows[1])).toHaveClass('positive');

  });

  it('should prune log stack when it exceeds max count', function() {

    // Set maxLength.
    log.options.maxLength = 5;

    // Ingest vote.
    Ov.vent.trigger('socket:vote:in', 'word3', 90);
    Ov.vent.trigger('socket:vote:in', 'word4', 80);
    Ov.vent.trigger('socket:vote:in', 'word5', 70);
    Ov.vent.trigger('socket:vote:in', 'word6', 60);
    Ov.vent.trigger('socket:vote:in', 'word7', 50);

    // Get word rows.
    var rows = log.primaryMarkup.find('div.log-row');
    expect(rows.length).toEqual(5);

    // Check parts.
    expect($(rows[0]).find('span.word').text()).toEqual('word7');
    expect($(rows[1]).find('span.word').text()).toEqual('word6');
    expect($(rows[2]).find('span.word').text()).toEqual('word5');
    expect($(rows[3]).find('span.word').text()).toEqual('word4');
    expect($(rows[4]).find('span.word').text()).toEqual('word3');

  });

  it('should freeze the stack on hover', function() {

    // Freeze.
    log.primaryMarkup.trigger('mouseenter');
    expect(log.primaryMarkup).toHaveClass('frozen');

  });

  it('should render point and blank previews on word hover', function() {

    // Get word rows.
    var rows = log.primaryMarkup.find('div.log-row');
    expect(rows.length).toEqual(5);

    // Hover.
    $(rows[0]).trigger('mouseenter');

    // Check for blank preview.
    expect(blank.$el.val()).toEqual('word7');

    // Check for point preview.
    expect(points.$el.text()).toEqual('950');
    expect(points.$el).toHaveClass('preview');

    // Blur.
    $(rows[0]).trigger('mouseleave');

    // Check for not blank preview.
    expect(blank.$el.val()).toEqual('');

    // Check for not point preview.
    expect(points.$el.text()).toEqual('1000');
    expect(points.$el).not.toHaveClass('preview');

  });

  it('should render new words in overflow during hover', function() {

    // Freeze.
    log.primaryMarkup.trigger('mouseenter');

    // Ingest new words.
    Ov.vent.trigger('socket:vote:in', 'word8', 40);
    Ov.vent.trigger('socket:vote:in', 'word9', 30);

    // Get overflow word rows.
    var rows = log.overflowMarkup.find('div.log-row');
    expect(rows.length).toEqual(2);

    // Check parts.
    expect($(rows[0]).find('span.value').text()).toEqual('30');
    expect($(rows[0]).find('span.word').text()).toEqual('word9');
    expect($(rows[1]).find('span.value').text()).toEqual('40');
    expect($(rows[1]).find('span.word').text()).toEqual('word8');

    // Unfreeze.
    log.primaryMarkup.trigger('mouseleave');

    // Get primary and overflow word rows.
    var pRows = log.primaryMarkup.find('div.log-row');
    expect(pRows.length).toEqual(5);
    var oRows = log.overflowMarkup.find('div.log-row');
    expect(oRows.length).toEqual(0);

    // Check parts.
    expect($(pRows[0]).find('span.word').text()).toEqual('word9');
    expect($(pRows[1]).find('span.word').text()).toEqual('word8');
    expect($(pRows[2]).find('span.word').text()).toEqual('word7');
    expect($(pRows[3]).find('span.word').text()).toEqual('word6');
    expect($(pRows[4]).find('span.word').text()).toEqual('word5');

  });

  it('should execute echo vote', function() {

    // Spy on socket vote release.
    spyOn(Ov.Controllers.Socket.s, 'emit');

    // Get word rows.
    var rows = log.primaryMarkup.find('div.log-row');

    // Echo.
    $(rows[0]).trigger('mouseenter');
    $(rows[0]).trigger('mousedown');

    // Check for vote release.
    expect(Ov.Controllers.Socket.s.emit).toHaveBeenCalledWith(
      'vote', 1, 'word9', 30);

    // Check for updated points preview.
    expect(points.$el.text()).toEqual('940');
    expect(points.$el).toHaveClass('preview');

    // Blur.
    $(rows[0]).trigger('mouseleave');

    // Check for updated points.
    expect(points.$el.text()).toEqual('970');
    expect(points.$el).not.toHaveClass('preview');

  });

  it('should block overbudget echo vote', function() {

    // Spy on socket vote release.
    spyOn(Ov.Controllers.Socket.s, 'emit');

    // Ingest new word.
    Ov.vent.trigger('socket:vote:in', 'word10', 1001);

    // Get word rows.
    var rows = log.primaryMarkup.find('div.log-row');

    // Hover.
    $(rows[0]).trigger('mouseenter');

    // Check for updated points preview.
    expect(points.$el.text()).toEqual('-1');
    expect(points.$el).toHaveClass('negative');

    // Echo.
    $(rows[0]).trigger('mousedown');

    // Check for vote release.
    expect(Ov.Controllers.Socket.s.emit).not.toHaveBeenCalledWith();


    // Blur.
    $(rows[0]).trigger('mouseleave');

    // Check for updated points.
    expect(points.$el.text()).toEqual('1000');
    expect(points.$el).not.toHaveClass('preview');

  });

});
