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
    $('div.left').remove();
  });

  describe('initialize', function() {

    it('should call render()', function() {

      // Spy on render.
      spyOn(poemView, 'render');

      // Construct view.
      poemView.initialize();

      // Check for render().
      expect(poemView.render).toHaveBeenCalled();

    });

    it('should construct blank', function() {

      // Construct view.
      poemView.initialize();

      // Check for blank
      expect(poemView.blank.el).toBe('div.blank');

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

});
