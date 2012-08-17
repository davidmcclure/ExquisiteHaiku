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

});
