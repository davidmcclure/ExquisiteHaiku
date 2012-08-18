/*
 * Unit tests for Stack.
 */

describe('Stack View', function() {

  var stackView;

  // Get fixtures, run app.
  beforeEach(function() {
    loadFixtures('index.html');
    loadFixtures('templates.html');
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
        ['word2', 99, 50, -50, '0.99']
      ])).toBeFalsy();

      // Check for no words.
      expect(stackView.$el).toBeEmpty();

    });

    it('should not execute when not visible', function() {

      stackView.visible = false;

      // Update.
      expect(stackView.update([
        ['word1', 100, 50, -50, '1.00'],
        ['word2', 99, 50, -50, '0.99']
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

        // Check word -> row associations.
        expect(stackView.wordsToRow['word1'].$el).toBe(words[0]);
        expect(stackView.wordsToRow['word2'].$el).toBe(words[1]);

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

        // Check word -> row associations.
        expect(stackView.wordsToRow['word3'].$el).toBe(words[0]);
        expect(stackView.wordsToRow['word4'].$el).toBe(words[1]);

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

        // Check word -> row associations.
        expect(stackView.wordsToRow['word3'].$el).toBe(words[0]);
        expect(stackView.wordsToRow['word4'].$el).toBe(words[1]);
        expect(stackView.wordsToRow['word1'].$el).toBe(words[2]);
        expect(stackView.wordsToRow['word2'].$el).toBe(words[3]);

      });

    });

  });

  describe('addRow', function() {

    it('should add the row markup', function() {

      var rows;

      // Add a row.
      stackView.addRow();
      rows = stackView.$el.find('div.stack-row');
      expect(rows.length).toEqual(1);

      // Add another row.
      stackView.addRow();
      rows = stackView.$el.find('div.stack-row');
      expect(rows.length).toEqual(2);

    });

    it('should update the rows tracker', function() {

      var rows;

      // Add a row.
      stackView.addRow();
      rows = stackView.$el.find('div.stack-row');
      expect(stackView.wordRows[0].$el).toBe(rows[0]);

      // Add another row.
      stackView.addRow();
      rows = stackView.$el.find('div.stack-row');
      expect(stackView.wordRows[1].$el).toBe(rows[1]);

    });

  });

  describe('setSelected', function() {

    beforeEach(function() {
      stackView.show();
      stackView.update([
        ['word1', 100, 50, -50, '1.00'],
        ['word2', 99, 49, -49, '0.99']
      ]);
    });

    it('should set the "selected" tracker', function() {
      stackView.setSelected('word1');
      expect(stackView.selected).toEqual('word1');
    });

    describe('when previously selected word is different', function() {

      it('should call endDrag() on previous word', function() {

        // Spy on word1 endDrag().
        var word1Row = stackView.wordsToRow['word1'];
        spyOn(word1Row, 'endDrag');

        // Select word1, then word2.
        stackView.setSelected('word1');
        stackView.setSelected('word2');
        expect(stackView.selected).toEqual('word2');
        expect(word1Row.endDrag).toHaveBeenCalled();

      });

    });

    describe('when previously selected word is the same', function() {

      it('should not call endDrag() on previous word', function() {

        // Spy on word1 endDrag().
        var word1Row = stackView.wordsToRow['word1'];
        spyOn(word1Row, 'endDrag');

        // Select word1, then word2.
        stackView.setSelected('word1');
        stackView.setSelected('word1');
        expect(stackView.selected).toEqual('word1');
        expect(word1Row.endDrag).not.toHaveBeenCalled();

      });

    });

  });

  describe('freeze', function() {

    it('should set "frozen" true', function() {
      stackView.freeze();
      expect(stackView.frozen).toBeTruthy();
    });

    it('should add "frozen" class', function() {
      stackView.freeze();
      expect(stackView.$el).toHaveClass('frozen');
    });

  });

  describe('unFreeze', function() {

    beforeEach(function() {
      stackView.freeze();
    });

    describe('when not dragging', function() {

      it('should set "frozen" false', function() {
        expect(stackView.unFreeze()).toBeTruthy();
        expect(stackView.frozen).toBeFalsy();
      });

      it('should remove "frozen" class', function() {
        expect(stackView.unFreeze()).toBeTruthy();
        expect(stackView.$el).not.toHaveClass('frozen');
      });

      it('should trigger "words:unhover"', function() {

        // Spy on words:unhover.
        var cb = jasmine.createSpy();
        Ov.vent.on('words:unhover', cb);

        // Unfreeze, listen for words:unhover.
        expect(stackView.unFreeze()).toBeTruthy();
        expect(cb).toHaveBeenCalled();

      });

    });

    describe('when dragging', function() {

      beforeEach(function() {
        Ov._global.isDragging = true;
      });

      it('should not set "frozen" false', function() {
        expect(stackView.unFreeze()).toBeFalsy();
        expect(stackView.frozen).toBeTruthy();
      });

      it('should not remove "frozen" class', function() {
        expect(stackView.unFreeze()).toBeFalsy();
        expect(stackView.$el).toHaveClass('frozen');
      });

      it('should not trigger "words:unhover"', function() {

        // Spy on words:unhover.
        var cb = jasmine.createSpy();
        Ov.vent.on('words:unhover', cb);

        // Unfreeze, listen for words:unhover.
        expect(stackView.unFreeze()).toBeFalsy();
        expect(cb).not.toHaveBeenCalled();

      });

    });

  });

  describe('show', function() {

    beforeEach(function() {
      stackView.hide();
    });

    it('should set "visible" tracker to true', function() {
      stackView.show();
      expect(stackView.visible).toBeTruthy();
    });

  });

  describe('hide', function() {

    beforeEach(function() {
      stackView.show();
      stackView.addRow();
    });

    it('should set "visible" tracker to false', function() {
      stackView.hide();
      expect(stackView.visible).toBeFalsy();
    });

    it('should empty the stack', function() {
      stackView.hide();
      expect(stackView.$el).toBeEmpty();
      expect(stackView.wordRows.length).toEqual(0);
    });

  });

  describe('empty', function() {

    beforeEach(function() {
      stackView.show();
      stackView.addRow();
    });

    it('should empty the stack', function() {
      stackView.empty();
      expect(stackView.$el).toBeEmpty();
      expect(stackView.wordRows.length).toEqual(0);
    });

  });

});
