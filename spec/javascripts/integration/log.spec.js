/*
 * Integration tests for log voting.
 */

describe('Log Voting', function() {

  var log, blank, points, rounds;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    Ov.Controllers.Round.Rounds.reset();
    Ov.Controllers.Log.Stack.delegateEvents();
  });

  beforeEach(function() {

    // Shortcut application objects.
    blank = Ov.Controllers.Poem.Blank;
    points = Ov.Controllers.Info.Points;
    rounds = Ov.Controllers.Round.Rounds;
    log = Ov.Controllers.Log.Stack;

    // Create round.
    rounds.currentRound = 'id';
    rounds.recordSubmission();

    // Set account value.
    points.value = 1000;

    // Set log maxLength.
    log.options.maxLength = 5;

    // Clear log.
    log.activateSubmit();

    // Activate voting.
    Ov.global.isVoting = true;

  });

  it('should render positive votes', function() {

    // Ingest vote.
    Ov.vent.trigger('socket:vote:in', 'word', 100);

    // Get word rows.
    var rows = log.primaryMarkup.find('div.log-row');
    expect(rows.length).toEqual(1);

    // Check parts.
    expect($(rows[0]).find('span.value').text()).toEqual('100');
    expect($(rows[0]).find('span.word').text()).toEqual('word');

    // Check color.
    expect($(rows[0])).toHaveClass('positive');

  });

  it('should render negative votes', function() {

    // Ingest vote.
    Ov.vent.trigger('socket:vote:in', 'word', -100);

    // Get word rows.
    var rows = log.primaryMarkup.find('div.log-row');
    expect(rows.length).toEqual(1);

    // Check parts.
    expect($(rows[0]).find('span.value').text()).toEqual('100');
    expect($(rows[0]).find('span.word').text()).toEqual('word');

    // Check color.
    expect($(rows[0])).toHaveClass('negative');

  });

  it('should prune log stack when it exceeds max count', function() {

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

    // Unfreeze.
    log.primaryMarkup.trigger('mouseleave');

  });

  it('should render point and blank previews on word hover', function() {

    // Ingest vote.
    Ov.vent.trigger('socket:vote:in', 'word', 100);

    // Get word rows.
    var rows = log.primaryMarkup.find('div.log-row');

    // Hover.
    $(rows[0]).trigger('mouseenter');

    // Check for blank preview.
    expect(blank.$el.val()).toEqual('word');

    // Check for point preview.
    expect(points.$el.text()).toEqual('900');
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

    // Ingest new words.
    Ov.vent.trigger('socket:vote:in', 'word1', 10);
    Ov.vent.trigger('socket:vote:in', 'word2', 20);
    Ov.vent.trigger('socket:vote:in', 'word3', 30);
    Ov.vent.trigger('socket:vote:in', 'word4', 40);
    Ov.vent.trigger('socket:vote:in', 'word5', 50);

    // Freeze.
    log.primaryMarkup.trigger('mouseenter');

    // Ingest new words.
    Ov.vent.trigger('socket:vote:in', 'word6', 60);
    Ov.vent.trigger('socket:vote:in', 'word7', 70);

    // Get overflow word rows.
    var rows = log.overflowMarkup.find('div.log-row');
    expect(rows.length).toEqual(2);

    // Check parts.
    expect($(rows[0]).find('span.value').text()).toEqual('70');
    expect($(rows[0]).find('span.word').text()).toEqual('word7');
    expect($(rows[1]).find('span.value').text()).toEqual('60');
    expect($(rows[1]).find('span.word').text()).toEqual('word6');

    // Unfreeze.
    log.primaryMarkup.trigger('mouseleave');

    // Get primary and overflow word rows.
    var pRows = log.primaryMarkup.find('div.log-row');
    expect(pRows.length).toEqual(5);
    var oRows = log.overflowMarkup.find('div.log-row');
    expect(oRows.length).toEqual(0);

    // Check parts.
    expect($(pRows[0]).find('span.word').text()).toEqual('word7');
    expect($(pRows[1]).find('span.word').text()).toEqual('word6');
    expect($(pRows[2]).find('span.word').text()).toEqual('word5');
    expect($(pRows[3]).find('span.word').text()).toEqual('word4');
    expect($(pRows[4]).find('span.word').text()).toEqual('word3');

  });

  it('should execute echo vote', function() {

    // Ingest vote.
    Ov.vent.trigger('socket:vote:in', 'word', 100);

    // Spy on socket vote release.
    spyOn(Ov.Controllers.Socket.s, 'emit');

    // Get word rows.
    var rows = log.primaryMarkup.find('div.log-row');

    // Echo.
    $(rows[0]).trigger('mouseenter');
    $(rows[0]).trigger('mousedown');

    // Check for vote release.
    expect(Ov.Controllers.Socket.s.emit).toHaveBeenCalledWith(
      'vote', 1, 'word', 100);

    // Check for updated points preview.
    expect(points.$el.text()).toEqual('800');
    expect(points.$el).toHaveClass('preview');

    // Blur.
    $(rows[0]).trigger('mouseleave');

    // Check for updated points.
    expect(points.$el.text()).toEqual('900');
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
