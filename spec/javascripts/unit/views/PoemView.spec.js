/*
 * Unit tests for Poem.
 */

describe('Poem View', function() {

  var poemView;

  // Get fixtures, run app.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    Ov.start();
  });

  beforeEach(function() {

    // Insert div#poem.
    container = $('<div id="poem" />');
    $('body').append(container);

    // Construct view.
    poemView = new Ov.Views.Poem();

  });

  afterEach(function() {
    container.remove();
  });

  describe('update', function() {

    var poem, lines;

    describe('duplicate checking', function() {

      it('should return false for unchanged poem', function() {

        // Set poem.
        poemView.syllables = 3;
        var newPoem = [['it', 'little']];

        // Call with unchanged poem.
        expect(poemView.update(newPoem, 3)).toBeFalsy();

      });

      it('should return true for changed poem', function() {

        // Set poem.
        poemView.syllables = 3;
        var newPoem = [['it', 'little', 'profits']];

        // Call with changed poem.
        expect(poemView.update(newPoem, 5)).toBeTruthy();

      });

    });

    describe('when there are no words', function() {

      beforeEach(function() {

        // Set no words.
        poem = [];

        // Call update(), get lines.
        poemView.update(poem, 0);
        lines = poemView.$el.find('div.poem-line');

      });

      it('should render 1 line', function() {

        // Get words.
        var words1 = $(lines[0]).find('span.poem-word');

        // 1 line.
        expect(lines.length).toEqual(1);

      });

    });

    describe('when there is an incomplete line 1', function() {

      beforeEach(function() {

        // Set < 1 line.
        var poem = [['it', 'little']];

        // Call update(), get lines.
        poemView.update(poem, 3);
        lines = poemView.$el.find('div.poem-line');

      });

      it('should render 1 line', function() {

        // Get words.
        var words1 = $(lines[0]).find('span.poem-word');

        // 1 line.
        expect(lines.length).toEqual(1);

        // Check line lengths.
        expect(words1.length).toEqual(2);

        // Check words.
        expect($(words1[0]).text()).toEqual('it');
        expect($(words1[1]).text()).toEqual('little');

      });

    });

    describe('when there is a complete line 1', function() {

      beforeEach(function() {

        // Set 1 line.
        poem = [['it', 'little', 'profits']];

        // Call update(), get lines.
        poemView.update(poem, 5);
        lines = poemView.$el.find('div.poem-line');

      });

      it('should render 2 lines', function() {

        // Get words.
        var words1 = $(lines[0]).find('span.poem-word');

        // 2 lines.
        expect(lines.length).toEqual(2);

        // Check line lengths.
        expect(words1.length).toEqual(3);

        // Check words.
        expect($(words1[0]).text()).toEqual('it');
        expect($(words1[1]).text()).toEqual('little');
        expect($(words1[2]).text()).toEqual('profits');

      });

    });

    describe('when there is an incomplete line 2', function() {

      beforeEach(function() {

        // Set < 2 lines.
        poem = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle']
        ];

        // Call update(), get lines.
        poemView.update(poem, 9);
        lines = poemView.$el.find('div.poem-line');

      });

      it('should render 2 lines', function() {

        // Get words.
        var words1 = $(lines[0]).find('span.poem-word');
        var words2 = $(lines[1]).find('span.poem-word');

        // 2 lines.
        expect(lines.length).toEqual(2);

        // Check line lengths.
        expect(words1.length).toEqual(3);
        expect(words2.length).toEqual(3);

        // Check words.
        expect($(words1[0]).text()).toEqual('it');
        expect($(words1[1]).text()).toEqual('little');
        expect($(words1[2]).text()).toEqual('profits');
        expect($(words2[0]).text()).toEqual('that');
        expect($(words2[1]).text()).toEqual('an');
        expect($(words2[2]).text()).toEqual('idle');

      });

    });

    describe('when there is a complete line 2', function() {

      beforeEach(function() {

        // Set 2 lines.
        poem = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this']
        ];

        // Call update(), get lines.
        poemView.update(poem, 12);
        lines = poemView.$el.find('div.poem-line');

      });

      it('should render 3 lines', function() {

        // Get words.
        var words1 = $(lines[0]).find('span.poem-word');
        var words2 = $(lines[1]).find('span.poem-word');

        // 2 lines.
        expect(lines.length).toEqual(3);

        // Check line lengths.
        expect(words1.length).toEqual(3);
        expect(words2.length).toEqual(6);

        // Check words.
        expect($(words1[0]).text()).toEqual('it');
        expect($(words1[1]).text()).toEqual('little');
        expect($(words1[2]).text()).toEqual('profits');
        expect($(words2[0]).text()).toEqual('that');
        expect($(words2[1]).text()).toEqual('an');
        expect($(words2[2]).text()).toEqual('idle');
        expect($(words2[3]).text()).toEqual('king');
        expect($(words2[4]).text()).toEqual('by');
        expect($(words2[5]).text()).toEqual('this');

      });

    });

    describe('when there is an incomplete line 3', function() {

      beforeEach(function() {

        // Set < 3 lines.
        poem = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this'],
          ['still', 'hearth']
        ];

        // Call update(), get lines.
        poemView.update(poem, 14);
        lines = poemView.$el.find('div.poem-line');

      });

      it('should render 3 lines', function() {

        // Get words.
        var words1 = $(lines[0]).find('span.poem-word');
        var words2 = $(lines[1]).find('span.poem-word');
        var words3 = $(lines[2]).find('span.poem-word');

        // 3 lines.
        expect(lines.length).toEqual(3);

        // Check line lengths.
        expect(words1.length).toEqual(3);
        expect(words2.length).toEqual(6);
        expect(words3.length).toEqual(2);

        // Check words.
        expect($(words1[0]).text()).toEqual('it');
        expect($(words1[1]).text()).toEqual('little');
        expect($(words1[2]).text()).toEqual('profits');
        expect($(words2[0]).text()).toEqual('that');
        expect($(words2[1]).text()).toEqual('an');
        expect($(words2[2]).text()).toEqual('idle');
        expect($(words2[3]).text()).toEqual('king');
        expect($(words2[4]).text()).toEqual('by');
        expect($(words2[5]).text()).toEqual('this');
        expect($(words3[0]).text()).toEqual('still');
        expect($(words3[1]).text()).toEqual('hearth');

      });

    });

    describe('when there is a complete line 3', function() {

      beforeEach(function() {

        // Set 3 lines.
        poem = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this'],
          ['still', 'hearth', 'among', 'these']
        ];

        // Call update(), get lines.
        poemView.update(poem, 17);
        lines = poemView.$el.find('div.poem-line');

      });

      it('should render 3 lines', function() {

        // Get lines and words.
        var words1 = $(lines[0]).find('span.poem-word');
        var words2 = $(lines[1]).find('span.poem-word');
        var words3 = $(lines[2]).find('span.poem-word');

        // 3 lines.
        expect(lines.length).toEqual(3);

        // Check line lengths.
        expect(words1.length).toEqual(3);
        expect(words2.length).toEqual(6);
        expect(words3.length).toEqual(4);

        // Check words.
        expect($(words1[0]).text()).toEqual('it');
        expect($(words1[1]).text()).toEqual('little');
        expect($(words1[2]).text()).toEqual('profits');
        expect($(words2[0]).text()).toEqual('that');
        expect($(words2[1]).text()).toEqual('an');
        expect($(words2[2]).text()).toEqual('idle');
        expect($(words2[3]).text()).toEqual('king');
        expect($(words2[4]).text()).toEqual('by');
        expect($(words2[5]).text()).toEqual('this');
        expect($(words3[0]).text()).toEqual('still');
        expect($(words3[1]).text()).toEqual('hearth');
        expect($(words3[2]).text()).toEqual('among');
        expect($(words3[3]).text()).toEqual('these');

      });

    });

  });

  describe('addLine', function() {

    it('should add a new line', function() {

      // Call addLine().
      poemView.addLine();

      // Check for line.
      var lines = poemView.$el.find('div.poem-line');
      expect(lines.length).toEqual(1);

    });

    it('should return the line', function() {

      // Call addLine().
      var line = poemView.addLine();
      expect(line).toBe('div.poem-line');

    });

    it('should add the line to the lines tracker', function() {

      // Call addLine().
      var line = poemView.addLine();
      expect(poemView.lines).toContain(line);

    });

  });

});
