/*
 * Unit tests for StackView.
 */

describe('Stack View', function() {

  var stackView;

  // Get fixtures, run app.
  beforeEach(function() {
    loadFixtures('fixtures.html');
    Ov.start();
  });

  // Construct view.
  beforeEach(function() {
    stackView = new Ov.Views.Stack();
  });

  describe('update', function() {

    it('should not execute when frozen', function() {

      stackView.frozen = true;

      // Update.
      expect(stackView.update([
        ['word1', 100, 50, -50, '1.00'],
        ['word1', 99, 50, -50, '0.99']
      ])).toBeFalsy();

      // Check for no words.
      expect(stackView.$el).toBeEmpty();

    });

    it('should not execute when not visible', function() {

      stackView.visible = false;

      // Update.
      expect(stackView.update([
        ['word1', 100, 50, -50, '1.00'],
        ['word1', 99, 50, -50, '0.99']
      ])).toBeFalsy();

      // Check for no words.
      expect(stackView.$el).toBeEmpty();

    });

    describe('when active', function() {

      beforeEach(function() {
        stackView.visible = true;
        stackView.frozen = false;
      });

      it('should add markup when none exists', function() {

        // Update.
        expect(stackView.update([
          ['word1', 100, 50, -50, '1.00'],
          ['word2', 99, 49, -49, '0.99']
        ])).toBeTruthy();

        // Check for no words.
        var words = stackView.$el.find('div');
        expect(words.length).toEqual(2);

        // Word1.
        expect($(words[0]).find('.ratio').text()).toEqual('1.00');
        expect($(words[0]).find('.word').text()).toEqual('word1');
        expect($(words[0]).find('.churn.pos').text()).toEqual('50');
        expect($(words[0]).find('.churn.neg').text()).toEqual('50');

        // Word2.
        expect($(words[1]).find('.ratio').text()).toEqual('0.99');
        expect($(words[1]).find('.word').text()).toEqual('word2');
        expect($(words[1]).find('.churn.pos').text()).toEqual('49');
        expect($(words[1]).find('.churn.neg').text()).toEqual('49');

      });

      it('should update markup when it exists', function() {

        // Add two words.
        expect(stackView.update([
          ['word1', 100, 50, -50, '1.00'],
          ['word2', 99, 49, -49, '0.99']
        ])).toBeTruthy();

        // Add two more words.
        expect(stackView.update([
          ['word3', 100, 50, -50, '1.00'],
          ['word4', 99, 49, -49, '0.99']
        ])).toBeTruthy();

        // Check for no words.
        var words = stackView.$el.find('div');
        expect(words.length).toEqual(2);

        // Word3.
        expect($(words[0]).find('.ratio').text()).toEqual('1.00');
        expect($(words[0]).find('.word').text()).toEqual('word3');
        expect($(words[0]).find('.churn.pos').text()).toEqual('50');
        expect($(words[0]).find('.churn.neg').text()).toEqual('50');

        // Word4.
        expect($(words[1]).find('.word').text()).toEqual('word4');
        expect($(words[1]).find('.churn.pos').text()).toEqual('49');
        expect($(words[1]).find('.churn.neg').text()).toEqual('49');
        expect($(words[1]).find('.ratio').text()).toEqual('0.99');

      });

      it('should add extra markup when there are new words', function() {

        // Add two words.
        expect(stackView.update([
          ['word1', 100, 50, -50, '1.00'],
          ['word2', 99, 49, -49, '0.99']
        ])).toBeTruthy();

        // Add two more words.
        expect(stackView.update([
          ['word3', 100, 50, -50, '1.00'],
          ['word4', 99, 49, -49, '0.99'],
          ['word1', 98, 48, -48, '0.98'],
          ['word2', 97, 47, -47, '0.97']
        ])).toBeTruthy();

        // Check for no words.
        var words = stackView.$el.find('div');
        expect(words.length).toEqual(4);

        // Word3.
        expect($(words[0]).find('.ratio').text()).toEqual('1.00');
        expect($(words[0]).find('.word').text()).toEqual('word3');
        expect($(words[0]).find('.churn.pos').text()).toEqual('50');
        expect($(words[0]).find('.churn.neg').text()).toEqual('50');

        // Word4.
        expect($(words[1]).find('.word').text()).toEqual('word4');
        expect($(words[1]).find('.churn.pos').text()).toEqual('49');
        expect($(words[1]).find('.churn.neg').text()).toEqual('49');
        expect($(words[1]).find('.ratio').text()).toEqual('0.99');

        // Word5.
        expect($(words[2]).find('.word').text()).toEqual('word1');
        expect($(words[2]).find('.churn.pos').text()).toEqual('48');
        expect($(words[2]).find('.churn.neg').text()).toEqual('48');
        expect($(words[2]).find('.ratio').text()).toEqual('0.98');

        // Word6.
        expect($(words[3]).find('.word').text()).toEqual('word2');
        expect($(words[3]).find('.churn.pos').text()).toEqual('47');
        expect($(words[3]).find('.churn.neg').text()).toEqual('47');
        expect($(words[3]).find('.ratio').text()).toEqual('0.97');

      });

    });

  });

});
