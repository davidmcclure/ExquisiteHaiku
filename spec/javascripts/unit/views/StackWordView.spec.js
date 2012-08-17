/*
 * Unit tests for StackWord.
 */

describe('Stack Word View', function() {

  var stackWordView;

  // Get fixtures, run app.
  beforeEach(function() {
    loadFixtures('fixtures.html');
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

});
