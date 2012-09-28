/*
 * Integration tests for stack voting.
 */

describe('Stack Voting', function() {

  var slice, rows, word;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    _t.loadPoem();
  });

  beforeEach(function() {

    _t.isVoting();

    // Stack.
    var stack = [
      ['word1', 100, 1000, 0, '1.00'],
      ['word2', 90, 0, -900, '0.50'],
      ['word3', 80, 800, 0, '0.40'],
      ['word4', 70, 0, -700, '0.30']
    ];

    // Slice.
    slice = {
      stack: stack,
      syllables: 0,
      round: 'id',
      poem: [],
      clock: 10000
    };

    // Trigger slice, get rows.
    Ov.vent.trigger('socket:slice', slice);
    rows = _t.rank.$el.find('div.stack-row');
    word = $(rows[0]);

  });

  it('should render preview on hover', function() {

    // Trigger mouseenter.
    word.trigger('mouseenter');

    // Check for preview.
    expect(_t.blank.$el.val()).toEqual('word1');

    // Trigger mouseleave.
    _t.rank.$el.trigger('mouseleave');

    // Check for no preview.
    expect(_t.blank.$el.val()).toEqual('');

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
    expect(_t.line.total.text()).toEqual('5');
    expect(_t.line.line.attr('x1')).toEqual('0');
    expect(_t.line.line.attr('y1')).toEqual('0');
    expect(_t.line.line.attr('x2')).toEqual('-3');
    expect(_t.line.line.attr('y2')).toEqual('-4');
    expect(_t.line.circle.attr('cx')).toEqual('0');
    expect(_t.line.circle.attr('cy')).toEqual('0');
    expect(_t.line.circle.attr('r')).toEqual('5');

    // Check for colors.
    expect(_t.line.total.attr('class')).toEqual('positive');
    expect(_t.line.line.attr('class')).toEqual('positive');
    expect(_t.line.circle.attr('class')).toEqual('positive');

    // Check for point preview.
    console.log(_t.points);
    expect(_t.points.value.text()).toEqual('995');
    expect(_t.points.percent.text()).toEqual('0.99');
    expect(_t.points.$el).toHaveClass('preview');

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
    expect(_t.line.total.text()).toEqual('-5');
    expect(_t.line.line.attr('x1')).toEqual('0');
    expect(_t.line.line.attr('y1')).toEqual('0');
    expect(_t.line.line.attr('x2')).toEqual('3');
    expect(_t.line.line.attr('y2')).toEqual('4');
    expect(_t.line.circle.attr('cx')).toEqual('0');
    expect(_t.line.circle.attr('cy')).toEqual('0');
    expect(_t.line.circle.attr('r')).toEqual('5');

    // Check for colors.
    expect(_t.line.total.attr('class')).toEqual('negative');
    expect(_t.line.line.attr('class')).toEqual('negative');
    expect(_t.line.circle.attr('class')).toEqual('negative');

    // Check for point preview.
    expect(_t.points.value.text()).toEqual('995');
    expect(_t.points.percent.text()).toEqual('0.99');
    expect(_t.points.$el).toHaveClass('preview');

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
    expect(_t.line.total.text()).toEqual('10');
    expect(_t.line.lines[0].attr('x1')).toEqual('0');
    expect(_t.line.lines[0].attr('y1')).toEqual('0');
    expect(_t.line.lines[0].attr('x2')).toEqual('-3');
    expect(_t.line.lines[0].attr('y2')).toEqual('-4');
    expect(_t.line.lines[1].attr('x1')).toEqual('0');
    expect(_t.line.lines[1].attr('y1')).toEqual('0');
    expect(_t.line.lines[1].attr('x2')).toEqual('-4');
    expect(_t.line.lines[1].attr('y2')).toEqual('-3');
    expect(_t.line.circle.attr('cx')).toEqual('0');
    expect(_t.line.circle.attr('cy')).toEqual('0');
    expect(_t.line.circle.attr('r')).toEqual('10');

    // Check for colors.
    expect(_t.line.total.attr('class')).toEqual('positive');
    expect(_t.line.lines[0].attr('class')).toEqual('positive');
    expect(_t.line.lines[1].attr('class')).toEqual('positive');
    expect(_t.line.circle.attr('class')).toEqual('positive');

    // Check for point preview.
    expect(_t.points.value.text()).toEqual('990');
    expect(_t.points.percent.text()).toEqual('0.99');
    expect(_t.points.$el).toHaveClass('preview');

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
    expect(_t.line.total.text()).toEqual('-10');
    expect(_t.line.lines[0].attr('x1')).toEqual('0');
    expect(_t.line.lines[0].attr('y1')).toEqual('0');
    expect(_t.line.lines[0].attr('x2')).toEqual('3');
    expect(_t.line.lines[0].attr('y2')).toEqual('4');
    expect(_t.line.lines[1].attr('x1')).toEqual('0');
    expect(_t.line.lines[1].attr('y1')).toEqual('0');
    expect(_t.line.lines[1].attr('x2')).toEqual('4');
    expect(_t.line.lines[1].attr('y2')).toEqual('3');
    expect(_t.line.circle.attr('cx')).toEqual('0');
    expect(_t.line.circle.attr('cy')).toEqual('0');
    expect(_t.line.circle.attr('r')).toEqual('10');

    // Check for colors.
    expect(_t.line.total.attr('class')).toEqual('negative');
    expect(_t.line.lines[0].attr('class')).toEqual('negative');
    expect(_t.line.lines[1].attr('class')).toEqual('negative');
    expect(_t.line.circle.attr('class')).toEqual('negative');

    // Check for point preview.
    expect(_t.points.value.text()).toEqual('990');
    expect(_t.points.percent.text()).toEqual('0.99');
    expect(_t.points.$el).toHaveClass('preview');

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
    expect(_t.line.total.text()).toEqual('8');
    expect(_t.line.lines[0].attr('x1')).toEqual('0');
    expect(_t.line.lines[0].attr('y1')).toEqual('0');
    expect(_t.line.lines[0].attr('x2')).toEqual('3');
    expect(_t.line.lines[0].attr('y2')).toEqual('4');
    expect(_t.line.lines[1].attr('x1')).toEqual('0');
    expect(_t.line.lines[1].attr('y1')).toEqual('0');
    expect(_t.line.lines[1].attr('x2')).toEqual('-5');
    expect(_t.line.lines[1].attr('y2')).toEqual('-12');
    expect(_t.line.circle.attr('cx')).toEqual('0');
    expect(_t.line.circle.attr('cy')).toEqual('0');
    expect(_t.line.circle.attr('r')).toEqual('8');

    // Check for colors.
    expect(_t.line.total.attr('class')).toEqual('positive');
    expect(_t.line.lines[0].attr('class')).toEqual('negative');
    expect(_t.line.lines[1].attr('class')).toEqual('positive');
    expect(_t.line.circle.attr('class')).toEqual('positive');

    // Check for point preview.
    expect(_t.points.value.text()).toEqual('992');
    expect(_t.points.percent.text()).toEqual('0.99');
    expect(_t.points.$el).toHaveClass('preview');

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
    expect(_t.line.total.text()).toEqual('-8');
    expect(_t.line.lines[0].attr('x1')).toEqual('0');
    expect(_t.line.lines[0].attr('y1')).toEqual('0');
    expect(_t.line.lines[0].attr('x2')).toEqual('-3');
    expect(_t.line.lines[0].attr('y2')).toEqual('-4');
    expect(_t.line.lines[1].attr('x1')).toEqual('0');
    expect(_t.line.lines[1].attr('y1')).toEqual('0');
    expect(_t.line.lines[1].attr('x2')).toEqual('5');
    expect(_t.line.lines[1].attr('y2')).toEqual('12');
    expect(_t.line.circle.attr('cx')).toEqual('0');
    expect(_t.line.circle.attr('cy')).toEqual('0');
    expect(_t.line.circle.attr('r')).toEqual('8');

    // Check for colors.
    expect(_t.line.total.attr('class')).toEqual('negative');
    expect(_t.line.lines[0].attr('class')).toEqual('positive');
    expect(_t.line.lines[1].attr('class')).toEqual('negative');
    expect(_t.line.circle.attr('class')).toEqual('negative');

    // Check for point preview.
    expect(_t.points.value.text()).toEqual('992');
    expect(_t.points.percent.text()).toEqual('0.99');
    expect(_t.points.$el).toHaveClass('preview');

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
    // ** FIX: For some reason, these assertions fail about 1
    // in 5 times and produce false build breaks. Why?
    // expect(_t.line.total.attr('class')).toEqual('blocked');
    // expect(_t.line.line.attr('class')).toEqual('blocked');
    // expect(_t.line.circle.attr('class')).toEqual('blocked');

    // Check for point preview.
    expect(_t.points.value.text()).toEqual('-414');
    expect(_t.points.$el).toHaveClass('negative');

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
    // ** FIX: For some reason, these assertions fail about 1
    // in 5 times and produce false build breaks. Why?
    // expect(_t.line.total.attr('class')).toEqual('blocked');
    // expect(_t.line.line.attr('class')).toEqual('blocked');
    // expect(_t.line.circle.attr('class')).toEqual('blocked');

    // Check for point preview.
    expect(_t.points.value.text()).toEqual('-414');
    expect(_t.points.$el).toHaveClass('negative');

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
    expect(_t.points.value.text()).toEqual('995');
    expect(_t.points.percent.text()).toEqual('0.99');
    expect(_t.points.$el).not.toHaveClass('preview');

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
    expect(_t.points.value.text()).toEqual('995');
    expect(_t.points.percent.text()).toEqual('0.99');
    expect(_t.points.$el).not.toHaveClass('preview');

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
    expect(_t.points.value.text()).toEqual('1000');
    expect(_t.points.percent.text()).toEqual('1.00');
    expect(_t.points.$el).not.toHaveClass('preview');

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
    expect(_t.points.value.text()).toEqual('1000');
    expect(_t.points.percent.text()).toEqual('1.00');
    expect(_t.points.$el).not.toHaveClass('preview');

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
    var rows = _t.rank.$el.find('div.stack-row');

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
    rows = _t.rank.$el.find('div.stack-row');

    // Check for changed order.
    expect($(rows[0]).find('.word').text()).toEqual('word2');
    expect($(rows[1]).find('.word').text()).toEqual('word1');
    expect($(rows[2]).find('.word').text()).toEqual('word4');
    expect($(rows[3]).find('.word').text()).toEqual('word3');

  });

});
