/*
 * Unit tests for PoemView.
 */

describe('Poem View', function() {

  var container, poemView;

  beforeEach(function() {

    // Get fixtures.
    loadFixtures('fixtures.html');

    // Insert div.left.
    container = $('<div class="left" />');
    $('body').append(container);

    // Construct view.
    poemView = new PoemView(container);

  });

  afterEach(function() {
    container.remove();
  });

  describe('initialize', function() {

    it('should call render()', function() {

      // Spy on render.
      spyOn(poemView, 'render');

      // Construct view.
      poemView.initialize(container);

      // Check for render().
      expect(poemView.render).toHaveBeenCalled();

    });

    it('should call buildTemplates()', function() {

      // Spy on buildTemplates.
      spyOn(poemView, 'buildTemplates');

      // Construct view.
      poemView.initialize(container);

      // Check for buildTemplates().
      expect(poemView.buildTemplates).toHaveBeenCalled();

    });

    it('should construct blank', function() {

      // Construct view.
      poemView.initialize(container);

      // Check for blank
      expect(poemView.blank.el).toBe('input.blank');

    });

  });

  describe('buildTemplates', function() {

    it('should set lineTemplate and wordTemplate', function() {

      // Build templates.
      poemView.buildTemplates();

      // Check for templates.
      expect(poemView.lineTemplate).toBeDefined();
      expect(poemView.lineTemplate).toBeDefined();

    });

  });

  describe('render', function() {

    it('should insert the poem container', function() {

      // Clear div.left.
      container.empty();

      // Render.
      poemView.render(container);

      // Check for poem.
      expect(container).toContain('div.poem');

    });

  });

  describe('update', function() {

    describe('word rendering', function() {

      it('should render 1 line', function() {

        // Set 1 line.
        var poem = [['it', 'little', 'profits']];

        // Call update().
        poemView.update(poem);

        // Get lines and words.
        var lines = poemView.$el.find('div.poem-line');
        var words1 = $(lines[0]).find('span.poem-word');

        // 1 line.
        expect(lines.length).toEqual(1);

        // Check line lengths.
        expect(words1.length).toEqual(3);

        // Check words.
        expect($(words1[0]).text()).toEqual('it');
        expect($(words1[1]).text()).toEqual('little');
        expect($(words1[2]).text()).toEqual('profits');

      });

      it('should render 2 lines', function() {

        // Set 2 lines.
        var poem = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this']
        ];

        // Call update().
        poemView.update(poem);

        // Get lines and words.
        var lines = poemView.$el.find('div.poem-line');
        var words1 = $(lines[0]).find('span.poem-word');
        var words2 = $(lines[1]).find('span.poem-word');

        // 2 lines.
        expect(lines.length).toEqual(2);

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

      it('should render 3 lines', function() {

        // Set 2 lines.
        var poem = [
          ['it', 'little', 'profits'],
          ['that', 'an', 'idle', 'king', 'by', 'this'],
          ['still', 'hearth', 'among', 'these']
        ];

        // Call update().
        poemView.update(poem);

        // Get lines and words.
        var lines = poemView.$el.find('div.poem-line');
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

});