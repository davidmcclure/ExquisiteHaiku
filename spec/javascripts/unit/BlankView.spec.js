/*
 * Unit tests for BlankView.
 */

describe('Blank View', function() {

  var blankView;

  // Get fixtures, run app.
  beforeEach(function() {
    loadFixtures('fixtures.html');
    Ov.start();
  });

  beforeEach(function() {

    // Construct view.
    blankView = new Ov.Views.Blank();

  });

  describe('insert', function() {

    var line;

    // Create line.
    beforeEach(function() {
      line = $('<div />');
    });

    it('should append the input element', function() {

      // Call insert(), check for input.
      blankView.insert(line);
      expect(line).toContain(blankView.$el);

    });

    it('should call position()', function() {

      // Spy on position.
      spyOn(blankView, 'position');

      // Call insert(), check for position().
      blankView.insert(line);
      expect(blankView.position).toHaveBeenCalledWith(line);

    });

  });

  describe('detach', function() {

    var line;

    // Create line, call insert().
    beforeEach(function() {
      line = $('<div />');
      blankView.insert(line);
    });

    it('should remove the input', function() {

      // Call detach(), check for no input.
      blankView.detach();
      expect(line).not.toContain(blankView.$el);

    });

  });

  describe('position', function() {

    var line;

    // Create line, call insert().
    beforeEach(function() {
      line = $('<div />');
      blankView.insert(line);
    });

    it('should append the stack to the line', function() {

      // Call position(), check for stack.
      blankView.position(line);
      expect(line).toContain(blankView.stack);

    });

    it('should position the stack under the input', function() {

      // Call position(), check for stack.
      blankView.position(line);

      // Get input offset and height.
      var inputOffset = blankView.$el.offset();
      var inputHeight = blankView.$el.outerHeight();

      // Get stack top/left css.
      var stackTop = parseInt(blankView.stack.css('top'), 10);
      var stackLeft = parseInt(blankView.stack.css('left'), 10);

      // Check positioning.
      expect(stackTop).toEqual(inputOffset.top + inputHeight);
      expect(stackLeft).toEqual(inputOffset.left);

    });

  });

  describe('activateSubmit', function() {

    beforeEach(function() {

      // Mock server word validation.
      Ov.vent.on('socket:validate', function(word, cb) {
        if (word == 'valid') cb(true);
        else if (word == 'invalid') cb(false);
      });

    });

    describe('regular keystroke', function() {

      it('should cache valid word as valid');

      it('should cache invalid word as invalid');

    });

    describe('enter keystroke', function() {

      it('should add valid word');

      it('should not add invalid word');

    });

  });

  describe('addWord', function() {

    it('should insert word when no words are present', function() {

      // Add a word, get words.
      blankView.addWord('word1');
      var words = blankView.stack.find('div.submission-word');

      expect(words.length).toEqual(1);
      expect($(words[0]).text()).toEqual('word1');

    });

    it('should prepend word when words are present', function() {

      // Add 2 words, get words.
      blankView.addWord('word1');
      blankView.addWord('word2');
      var words = blankView.stack.find('div.submission-word');

      expect(words.length).toEqual(2);
      expect($(words[0]).text()).toEqual('word2');
      expect($(words[1]).text()).toEqual('word1');

    });

    it('should add the word to the words tracker', function() {

      // Add a word.
      blankView.addWord('word1');
      expect(blankView.words).toEqual(['word1']);

    });

    it('should store the word value on the word element', function() {

      // Add a word, get words.
      blankView.addWord('word1');
      var words = blankView.stack.find('div.submission-word');

      expect($(words[0]).data('word')).toEqual('word1');

    });

    it('should clear the input', function() {

      // Fill input
      blankView.$el.val('word');

      // Call addWord().
      blankView.addWord('word');

      // Check for empty input.
      expect(blankView.$el.val()).toEqual('');

    });

    describe('mousedown event', function() {

      it('should remove the word', function() {

      });

    });

  });

});
