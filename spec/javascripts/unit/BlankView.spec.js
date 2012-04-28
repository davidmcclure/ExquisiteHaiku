/*
 * Unit tests for BlankView.
 */

describe('Blank View', function() {

  var blank;

  beforeEach(function() {

    // Get fixtures.
    loadFixtures('fixtures.html');

    // Construct view.
    blank = new BlankView();

  });

  afterEach(function() {

  });

  describe('insert', function() {

    var line;

    beforeEach(function() {
      line = $('<div class="poem-line" />');
    });

    it('should insert blank when line is empty', function() {

      // Call insert();
      blank.insert(line);

      // Check for blank.
      expect(line).toContain('input.blank');

    });

    it('should append blank to end when line has words', function() {

      // Add words to line.
      line.append($('<div class="poem-word">it</div>'));
      line.append($('<div class="poem-word">is</div>'));

      // Call insert().
      blank.insert(line);

      // Check ordering.
      var contents = line.find('*');
      expect(contents[0]).toBe('div.poem-word');
      expect(contents[1]).toBe('div.poem-word');
      expect(contents[2]).toBe('input.blank');

    });

  });

});
