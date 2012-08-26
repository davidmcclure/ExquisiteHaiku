/*
 * Integration tests for stack voting.
 */

describe('Stack Voting', function() {

  var stack, blank, line, points,
    rounds, slice, rows, word;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    Ov.Controllers.Round.Rounds.reset();
    Ov.Controllers.Stack.Rank.delegateEvents();
  });

  beforeEach(function() {

    // Shortcut views.
    stack = Ov.Controllers.Stack.Rank;
    blank = Ov.Controllers.Poem.Blank;
    line = Ov.Controllers.Stack.Line;
    rounds = Ov.Controllers.Round.Rounds;
    points = Ov.Controllers.Info.Points;

    // Create round.
    rounds.currentRound = 'id';
    rounds.recordSubmission();

    // Set account value.
    points.value = 1000;

    // Activate voting.
    Ov.global.isVoting = true;

    // Data slice.
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

    // Clear stack.
    stack.empty();

    // Trigger slice, get rows.
    Ov.vent.trigger('socket:slice', slice);
    rows = stack.$el.find('div.stack-row');
    word = $(rows[0]);

  });

  it('should render preview on hover', function() {

    // Trigger mouseenter.
    word.trigger('mouseenter');

    // Check for preview.
    expect(blank.$el.val()).toEqual('word1');

    // Trigger mouseleave.
    stack.$el.trigger('mouseleave');

    // Check for no preview.
    expect(blank.$el.val()).toEqual('');

  });

  it('should render positive drag', function() {

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: -3, pageY: -4 
    }));

    // Check for values and dimensions.
    expect(line.total.text()).toEqual('5');
    expect(line.line.attr('x1')).toEqual('0');
    expect(line.line.attr('y1')).toEqual('0');
    expect(line.line.attr('x2')).toEqual('-3');
    expect(line.line.attr('y2')).toEqual('-4');
    expect(line.circle.attr('cx')).toEqual('0');
    expect(line.circle.attr('cy')).toEqual('0');
    expect(line.circle.attr('r')).toEqual('5');

    // Check for colors.
    expect(line.total.attr('class')).toEqual('positive');
    expect(line.line.attr('class')).toEqual('positive');
    expect(line.circle.attr('class')).toEqual('positive');

    // Check for point preview.
    expect(points.$el.text()).toEqual('995');
    expect(points.$el).toHaveClass('preview');

    // Cancel drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 27
    }));

    // Check for no drag.
    expect($('body')).not.toContain('div.drag-line');

  });

  it('should render negative drag', function() {

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: 3, pageY: 4 
    }));

    // Check for values and dimensions.
    expect(line.total.text()).toEqual('-5');
    expect(line.line.attr('x1')).toEqual('0');
    expect(line.line.attr('y1')).toEqual('0');
    expect(line.line.attr('x2')).toEqual('3');
    expect(line.line.attr('y2')).toEqual('4');
    expect(line.circle.attr('cx')).toEqual('0');
    expect(line.circle.attr('cy')).toEqual('0');
    expect(line.circle.attr('r')).toEqual('5');

    // Check for colors.
    expect(line.total.attr('class')).toEqual('negative');
    expect(line.line.attr('class')).toEqual('negative');
    expect(line.circle.attr('class')).toEqual('negative');

    // Check for point preview.
    expect(points.$el.text()).toEqual('995');
    expect(points.$el).toHaveClass('preview');

    // Cancel drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 27
    }));

    // Check for no drag.
    expect($('body')).not.toContain('div.drag-line');

  });

  it('should render multi-line positive drag', function() {

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: -3, pageY: -4 
    }));

    // Release.
    $(window).trigger('mouseup');

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: -4, pageY: -3 
    }));

    // Release.
    $(window).trigger('mouseup');

    // Check for values and dimensions.
    expect(line.total.text()).toEqual('10');
    expect(line.lines[0].attr('x1')).toEqual('0');
    expect(line.lines[0].attr('y1')).toEqual('0');
    expect(line.lines[0].attr('x2')).toEqual('-3');
    expect(line.lines[0].attr('y2')).toEqual('-4');
    expect(line.lines[1].attr('x1')).toEqual('0');
    expect(line.lines[1].attr('y1')).toEqual('0');
    expect(line.lines[1].attr('x2')).toEqual('-4');
    expect(line.lines[1].attr('y2')).toEqual('-3');
    expect(line.circle.attr('cx')).toEqual('0');
    expect(line.circle.attr('cy')).toEqual('0');
    expect(line.circle.attr('r')).toEqual('10');

    // Check for colors.
    expect(line.total.attr('class')).toEqual('positive');
    expect(line.lines[0].attr('class')).toEqual('positive');
    expect(line.lines[1].attr('class')).toEqual('positive');
    expect(line.circle.attr('class')).toEqual('positive');

    // Check for point preview.
    expect(points.$el.text()).toEqual('990');
    expect(points.$el).toHaveClass('preview');

    // Cancel drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 27
    }));

    // Check for no drag.
    expect($('body')).not.toContain('div.drag-line');

  });

  it('should render multi-line negative drag', function() {

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: 3, pageY: 4 
    }));

    // Release.
    $(window).trigger('mouseup');

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: 4, pageY: 3 
    }));

    // Release.
    $(window).trigger('mouseup');

    // Check for values and dimensions.
    expect(line.total.text()).toEqual('-10');
    expect(line.lines[0].attr('x1')).toEqual('0');
    expect(line.lines[0].attr('y1')).toEqual('0');
    expect(line.lines[0].attr('x2')).toEqual('3');
    expect(line.lines[0].attr('y2')).toEqual('4');
    expect(line.lines[1].attr('x1')).toEqual('0');
    expect(line.lines[1].attr('y1')).toEqual('0');
    expect(line.lines[1].attr('x2')).toEqual('4');
    expect(line.lines[1].attr('y2')).toEqual('3');
    expect(line.circle.attr('cx')).toEqual('0');
    expect(line.circle.attr('cy')).toEqual('0');
    expect(line.circle.attr('r')).toEqual('10');

    // Check for colors.
    expect(line.total.attr('class')).toEqual('negative');
    expect(line.lines[0].attr('class')).toEqual('negative');
    expect(line.lines[1].attr('class')).toEqual('negative');
    expect(line.circle.attr('class')).toEqual('negative');

    // Check for point preview.
    expect(points.$el.text()).toEqual('990');
    expect(points.$el).toHaveClass('preview');

    // Cancel drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 27
    }));

    // Check for no drag.
    expect($('body')).not.toContain('div.drag-line');

  });

  it('should render multi-line mixed-sign net positive drag', function() {

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: 3, pageY: 4 
    }));

    // Release.
    $(window).trigger('mouseup');

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: -5, pageY: -12
    }));

    // Release.
    $(window).trigger('mouseup');

    // Check for values and dimensions.
    expect(line.total.text()).toEqual('8');
    expect(line.lines[0].attr('x1')).toEqual('0');
    expect(line.lines[0].attr('y1')).toEqual('0');
    expect(line.lines[0].attr('x2')).toEqual('3');
    expect(line.lines[0].attr('y2')).toEqual('4');
    expect(line.lines[1].attr('x1')).toEqual('0');
    expect(line.lines[1].attr('y1')).toEqual('0');
    expect(line.lines[1].attr('x2')).toEqual('-5');
    expect(line.lines[1].attr('y2')).toEqual('-12');
    expect(line.circle.attr('cx')).toEqual('0');
    expect(line.circle.attr('cy')).toEqual('0');
    expect(line.circle.attr('r')).toEqual('8');

    // Check for colors.
    expect(line.total.attr('class')).toEqual('positive');
    expect(line.lines[0].attr('class')).toEqual('negative');
    expect(line.lines[1].attr('class')).toEqual('positive');
    expect(line.circle.attr('class')).toEqual('positive');

    // Check for point preview.
    expect(points.$el.text()).toEqual('992');
    expect(points.$el).toHaveClass('preview');

    // Cancel drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 27
    }));

    // Check for no drag.
    expect($('body')).not.toContain('div.drag-line');

  });

  it('should render multi-line mixed-sign net negative drag', function() {

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: -3, pageY: -4 
    }));

    // Release.
    $(window).trigger('mouseup');

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: 5, pageY: 12
    }));

    // Release.
    $(window).trigger('mouseup');

    // Check for values and dimensions.
    expect(line.total.text()).toEqual('-8');
    expect(line.lines[0].attr('x1')).toEqual('0');
    expect(line.lines[0].attr('y1')).toEqual('0');
    expect(line.lines[0].attr('x2')).toEqual('-3');
    expect(line.lines[0].attr('y2')).toEqual('-4');
    expect(line.lines[1].attr('x1')).toEqual('0');
    expect(line.lines[1].attr('y1')).toEqual('0');
    expect(line.lines[1].attr('x2')).toEqual('5');
    expect(line.lines[1].attr('y2')).toEqual('12');
    expect(line.circle.attr('cx')).toEqual('0');
    expect(line.circle.attr('cy')).toEqual('0');
    expect(line.circle.attr('r')).toEqual('8');

    // Check for colors.
    expect(line.total.attr('class')).toEqual('negative');
    expect(line.lines[0].attr('class')).toEqual('positive');
    expect(line.lines[1].attr('class')).toEqual('negative');
    expect(line.circle.attr('class')).toEqual('negative');

    // Check for point preview.
    expect(points.$el.text()).toEqual('992');
    expect(points.$el).toHaveClass('preview');

    // Cancel drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 27
    }));

    // Check for no drag.
    expect($('body')).not.toContain('div.drag-line');

  });

  it('should render overbudget positive drag', function() {

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: -1000, pageY: -1000
    }));

    // Check for colors.
    expect(line.total.attr('class')).toEqual('blocked');
    expect(line.line.attr('class')).toEqual('blocked');
    expect(line.circle.attr('class')).toEqual('blocked');

    // Check for point preview.
    expect(points.$el.text()).toEqual('-414');
    expect(points.$el).toHaveClass('negative');

    // Cancel drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 27
    }));

    // Check for no drag.
    expect($('body')).not.toContain('div.drag-line');

  });

  it('should render overbudget negative drag', function() {

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: 1000, pageY: 1000
    }));

    // Check for colors.
    expect(line.total.attr('class')).toEqual('blocked');
    expect(line.line.attr('class')).toEqual('blocked');
    expect(line.circle.attr('class')).toEqual('blocked');

    // Check for point preview.
    expect(points.$el.text()).toEqual('-414');
    expect(points.$el).toHaveClass('negative');

    // Cancel drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 27
    }));

    // Check for no drag.
    expect($('body')).not.toContain('div.drag-line');

  });

  it('should execute positive vote', function() {

    // Spy on socket vote release.
    spyOn(Ov.Controllers.Socket.s, 'emit');

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: -3, pageY: -4 
    }));

    // Commit drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 32
    }));

    // Check for no drag.
    expect($('body')).not.toContain('div.drag-line');

    // Check for commited points.
    expect(points.$el.text()).toEqual('995');
    expect(points.$el).not.toHaveClass('preview');

    // Check for vote release.
    expect(Ov.Controllers.Socket.s.emit).toHaveBeenCalledWith(
      'vote', 1, 'word1', 5);

  });

  it('should execute negative vote', function() {

    // Spy on socket vote release.
    spyOn(Ov.Controllers.Socket.s, 'emit');

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: 3, pageY: 4 
    }));

    // Commit drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 32
    }));

    // Check for no drag.
    expect($('body')).not.toContain('div.drag-line');

    // Check for commited points.
    expect(points.$el.text()).toEqual('995');
    expect(points.$el).not.toHaveClass('preview');

    // Check for vote release.
    expect(Ov.Controllers.Socket.s.emit).toHaveBeenCalledWith(
      'vote', 1, 'word1', -5);

  });

  it('should block overbudget positive vote', function() {

    // Spy on socket vote release.
    spyOn(Ov.Controllers.Socket.s, 'emit');

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: -1000, pageY: -1000
    }));

    // Commit drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 32
    }));

    // Check for no drag.
    expect($('body')).not.toContain('div.drag-line');

    // Check for commited points.
    expect(points.$el.text()).toEqual('1000');
    expect(points.$el).not.toHaveClass('preview');

    // Check for vote release.
    expect(Ov.Controllers.Socket.s.emit).not.toHaveBeenCalled();

  });

  it('should block overbudget negative vote', function() {

    // Spy on socket vote release.
    spyOn(Ov.Controllers.Socket.s, 'emit');

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: 1000, pageY: 1000
    }));

    // Commit drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 32
    }));

    // Check for no drag.
    expect($('body')).not.toContain('div.drag-line');

    // Check for commited points.
    expect(points.$el.text()).toEqual('1000');
    expect(points.$el).not.toHaveClass('preview');

    // Check for vote release.
    expect(Ov.Controllers.Socket.s.emit).not.toHaveBeenCalledWith();

  });

  it('should not update stack during drag', function() {

    // Click.
    word.trigger($.Event('mousedown', {
      pageX: 0, pageY: 0
    }));

    // Drag.
    $(window).trigger($.Event('mousemove', {
      pageX: 3, pageY: 4 
    }));

    // Mock new stack.
    slice.stack = [
      ['word2', 100, 1000, 0, '1.00'],
      ['word1', 90, 0, -900, '0.50'],
      ['word4', 80, 800, 0, '0.40'],
      ['word3', 70, 0, -700, '0.30']
    ];

    // Should block rendering when dragging.
    // -------------------------------------

    // Trigger slice.
    Ov.vent.trigger('socket:slice', slice);

    // Get word rows.
    var rows = stack.$el.find('div.stack-row');

    // Check for unchanged order.
    expect($(rows[0]).find('.word').text()).toEqual('word1');
    expect($(rows[1]).find('.word').text()).toEqual('word2');
    expect($(rows[2]).find('.word').text()).toEqual('word3');
    expect($(rows[3]).find('.word').text()).toEqual('word4');

    // Cancel drag.
    $(window).trigger($.Event('keydown.drag', {
      keyCode: 27
    }));

    // Should resume rendering when drag ends.
    // ---------------------------------------

    // Trigger slice.
    Ov.vent.trigger('socket:slice', slice);

    // Get word rows.
    rows = stack.$el.find('div.stack-row');

    // Check for changed order.
    expect($(rows[0]).find('.word').text()).toEqual('word2');
    expect($(rows[1]).find('.word').text()).toEqual('word1');
    expect($(rows[2]).find('.word').text()).toEqual('word4');
    expect($(rows[3]).find('.word').text()).toEqual('word3');

  });

});
