/*
 * Unit tests for StackWord.
 */

describe('Stack Word View', function() {

  var stackWordView;

  // Get fixtures, run app.
  beforeEach(function() {
    loadFixtures('index.html');
    loadFixtures('templates.html');
    Ov.start();
  });

  // Construct view.
  beforeEach(function() {
    stackWordView = new Ov.Views.StackWord();
  });

  describe('update', function() {

    it('should set view data trackers', function() {
      stackWordView.update(['word', 100, 50, -50, '1.00']);
      expect(stackWordView.word).toEqual('word');
      expect(stackWordView.posChurn).toEqual(50);
      expect(stackWordView.negChurn).toEqual(-50);
      expect(stackWordView.ratio).toEqual('1.00');
    });

    it('should render data', function() {
      stackWordView.update(['word', 100, 60, -40, '1.00']);
      expect(stackWordView.$el.find('.word')).toHaveText('word');
      expect(stackWordView.$el.find('.churn.pos')).toHaveText('60');
      expect(stackWordView.$el.find('.churn.neg')).toHaveText('40');
      expect(stackWordView.$el.find('.ratio')).toHaveText('1.00');
    });

    it('should update styles', function() {
      spyOn(stackWordView, 'renderSize');
      spyOn(stackWordView, 'renderColor');
      stackWordView.update(['word', 100, 60, -40, '1.00']);
      expect(stackWordView.renderSize).toHaveBeenCalled();
      expect(stackWordView.renderColor).toHaveBeenCalled();
    });

  });

  describe('addDrag', function() {

    var e;

    beforeEach(function() {
      e = $.Event('mousedown');
    });

    afterEach(function() {
      stackWordView.endDrag();
    });

    it('should bind drag events on window', function() {

      // Mock events.
      var mousemove = $.Event('mousemove.drag');
      var mouseup = $.Event('mouseup.drag');
      var keydown = $.Event('keydown.drag');

      // Spy on event callbacks.
      spyOn(stackWordView, 'onDragTick');
      spyOn(stackWordView, 'onDragComplete');
      spyOn(stackWordView, 'onDragKeydown');

      // Add drag.
      stackWordView.addDrag(e);

      // Check mousemove.
      $(window).trigger(mousemove);
      expect(stackWordView.onDragTick).toHaveBeenCalledWith(
        e, mousemove);

      // Check mouseup.
      $(window).trigger(mouseup);
      expect(stackWordView.onDragComplete).toHaveBeenCalled();

      // Check keydown.
      $(window).trigger(keydown);
      expect(stackWordView.onDragKeydown).toHaveBeenCalledWith(keydown);

    });

    it('should reset dragDelta to 0', function() {
      stackWordView.dragDelta = 100;
      stackWordView.addDrag(e);
      expect(stackWordView.dragDelta).toEqual(0);
    });

    it('should trigger "words:dragStart"', function() {

      // Update word data.
      stackWordView.update(['word', 100, 50, -50, '1.00']);

      // Spy on words:dragStart.
      var cb = jasmine.createSpy();
      Ov.vent.on('words:dragStart', cb);

      // Add drag.
      stackWordView.addDrag(e);
      expect(cb).toHaveBeenCalledWith('word');

    });

    it('should set global isDragging true', function() {
      Ov._global.isDragging = false;
      stackWordView.addDrag(e);
      expect(Ov._global.isDragging).toBeTruthy();
    });

  });

  describe('onDragTick', function() {

    var initEvent, dragEvent;

    beforeEach(function() {
      stackWordView.update(['word', 100, 50, -50, '1.00']);
      initEvent = { pageX: 0, pageY: 0 };
      dragEvent = { pageX: 3, pageY: 4 };
    });

    it('should compute dragDelta', function() {

      // Negative drag.
      stackWordView.onDragTick(initEvent, dragEvent);
      expect(stackWordView.dragDelta).toEqual(-5);

      // Positive drag.
      dragEvent = { pageX: -3, pageY: -4 };
      stackWordView.onDragTick(initEvent, dragEvent);
      expect(stackWordView.dragDelta).toEqual(5);

    });

    it('should set color', function() {

      // Spy on style setters.
      spyOn(stackWordView, 'setDragPositive');
      spyOn(stackWordView, 'setDragNegative');

      // Negative drag.
      stackWordView.onDragTick(initEvent, dragEvent);
      expect(stackWordView.setDragNegative).toHaveBeenCalled();

      // Positive drag.
      dragEvent = { pageX: -3, pageY: -4 };
      stackWordView.onDragTick(initEvent, dragEvent);
      expect(stackWordView.setDragPositive).toHaveBeenCalled();

    });

    it('should trigger "words:dragTick"', function() {

      // Spy on words:dragTick.
      var cb = jasmine.createSpy();
      Ov.vent.on('words:dragTick', cb);

      // Set dragTotal.
      stackWordView.dragTotal = 100;

      // Negative drag.
      stackWordView.onDragTick(initEvent, dragEvent);
      expect(cb).toHaveBeenCalledWith(
        'word', 95, initEvent, dragEvent
      );

      // Positive drag.
      dragEvent = { pageX: -3, pageY: -4 };
      stackWordView.onDragTick(initEvent, dragEvent);
      expect(cb).toHaveBeenCalledWith(
        'word', 105, initEvent, dragEvent
      );

    });

  });

  describe('onDragComplete', function() {

    it('should unbind mouse drag events');
    it('should merge dragDelta into dragTotal');
    it('should reset dragDelta');
    it('should trigger "words:dragStop"');

  });

  describe('onDragKeydown', function() {

    describe('when spacebar is pressed', function() {

      it('should call endDrag()');
      it('should trigger "words:dragCommit"');

    });

    describe('when ESC is pressed', function() {

      it('should call endDrag()');
      it('should trigger "words:dragCancel"');

    });

  });

  describe('hover', function() {

    it('should break if dragging');
    it('should trigger "words:hover"');

  });

  describe('select', function() {

    it('should trigger "words:select"');
    it('should call addDrag()');

  });

  describe('unselect', function() {

    it('should trigger "words:unselect"');
    it('should call addDrag()');

  });

  describe('endDrag', function() {

    it('should call unSelect()');
    it('should reset dragTotal');
    it('should set _global.isDragging false');
    it('should unbind all .drag events');

  });

});
