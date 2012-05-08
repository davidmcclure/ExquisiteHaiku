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

    describe('when activateSubmit has not been called', function() {

      it('should not bind keypress event on the input', function() {

        // Spy on addWord();
        spyOn(blankView, 'processKeystroke');

        // Trigger keypress.
        blankView.$el.keypress();
        expect(blankView.processKeystroke).not.toHaveBeenCalled();

      });

    });

    describe('when activateSubmit has been called', function() {

      it('should not bind keypress event on the input', function() {

        // Spy on addWord();
        spyOn(blankView, 'processKeystroke');

        // Mock keypress event.
        var e = $.Event('keypress');

        // Activate submission.
        blankView.activateSubmit();

        // Trigger keypress.
        blankView.$el.trigger(e);
        expect(blankView.processKeystroke).toHaveBeenCalledWith(e);

      });

    });

  });

  describe('processKeystroke', function() {

    var e;

    beforeEach(function() {

      // Mock server word validation.
      Ov.vent.on('socket:validate', function(word, cb) {
        if (word == 'valid') cb(true);
        else if (word == 'invalid') cb(false);
      });

      // Mock keypress event.
      e = $.Event('keypress');

    });

    describe('regular keystroke', function() {

      it('should cache valid word as valid', function() {

        // Set valid input value.
        blankView.$el.val('valid');
        blankView.processKeystroke(e);

        // Check for cached word.
        expect(blankView.cache.valid).toContain('valid');

      });

      it('should cache invalid word as invalid', function() {

        // Set valid input value.
        blankView.$el.val('invalid');
        blankView.processKeystroke(e);

        // Check for cached word.
        expect(blankView.cache.invalid).toContain('invalid');

      });

    });

    describe('enter keystroke', function() {

      it('should add valid word', function() {

        // Spy on addWord();
        spyOn(blankView, 'addWord');

        // Set keycode and value.
        e.keyCode = 13;
        blankView.$el.val('valid');
        blankView.processKeystroke(e);

        // Check for cached word.
        expect(blankView.addWord).toHaveBeenCalledWith('valid');

      });

      it('should not add invalid word', function() {

        // Spy on addWord();
        spyOn(blankView, 'addWord');

        // Set keycode and value.
        e.keyCode = 13;
        blankView.$el.val('invalid');
        blankView.processKeystroke(e);

        // Check for cached word.
        expect(blankView.addWord).not.toHaveBeenCalledWith();

      });

    });

  });

  describe('addWord', function() {

    it('should insert word when no words are present', function() {

      // Add a word, get words.
      blankView.addWord('word1');
      var words = blankView.stack.find('div');

      expect(words.length).toEqual(1);
      expect($(words[0]).text()).toEqual('word1');

    });

    it('should prepend word when words are present', function() {

      // Add 2 words, get words.
      blankView.addWord('word1');
      blankView.addWord('word2');
      var words = blankView.stack.find('div');

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
      var words = blankView.stack.find('div');

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

      var word;

      // Add a word.
      beforeEach(function() {
        blankView.addWord('word');
        word = blankView.stack.find('div');
      });

      it('should remove the word', function() {

        // Trigger mousedown on word.
        word.mousedown();
        expect(blankView.stack).toBeEmpty();

      });

    });

  });

  describe('scrubWord', function() {

    it('should trim the word', function() {
      expect(blankView.scrubWord('  word ')).toEqual('word');
    });

    it('should lowercase the word', function() {
      expect(blankView.scrubWord('WoRd')).toEqual('word');
    });

  });

  describe('validateWord', function() {

    var cb;

    beforeEach(function() {

      // Mock server word validation.
      Ov.vent.on('socket:validate', function(word, cb) {
        cb('server');
      });

      // Create spy.
      cb = jasmine.createSpy();

    });

    it('should call with false for duplicate', function() {

      // Set words.
      blankView.words = ['word'];
      blankView.validateWord('word', cb);
      expect(cb).toHaveBeenCalledWith(false);

    });

    it('should call with false if word is cached as invalid', function() {

      // Cache word as invalid.
      blankView.cache.invalid.push('word');
      blankView.validateWord('word', cb);
      expect(cb).toHaveBeenCalledWith(false);

    });

    it('should call with true if word is cached as valid', function() {

      // Cache word as invalid.
      blankView.cache.valid.push('word');
      blankView.validateWord('word', cb);
      expect(cb).toHaveBeenCalledWith(true);

    });

    it('should do server validation if word cannot be validated locally', function() {

      // Set stack and caches.
      blankView.words = ['word1'];
      blankView.cache.valid.push('word2');
      blankView.cache.invalid.push('word3');

      // Validate with word that is not a duplicate or cached.
      blankView.validateWord('word4', cb);
      expect(cb).toHaveBeenCalledWith('server');

    });

  });

  describe('cacheValidation', function() {

    describe('when the word is valid', function() {

      it('should add to cache if not already present', function() {
        blankView.cacheValidation('word', true);
        expect(blankView.cache.valid).toEqual(['word']);
      });

      it('should not add to cache if already present', function() {
        blankView.cache.valid.push('word');
        blankView.cacheValidation('word', true);
        expect(blankView.cache.valid).toEqual(['word']);
      });

    });

    describe('when the word is invalid', function() {

      it('should add to cache if not already present', function() {
        blankView.cacheValidation('word', false);
        expect(blankView.cache.invalid).toEqual(['word']);
      });

      it('should not add to cache if already present', function() {
        blankView.cache.invalid.push('word');
        blankView.cacheValidation('word', false);
        expect(blankView.cache.invalid).toEqual(['word']);
      });

    });

  });

  describe('removeWord', function() {

    var words;

    beforeEach(function() {

      // Add words.
      blankView.addWord('word1');
      blankView.addWord('word2');

      // Get markup.
      words = blankView.stack.find('div');

    });

    it('should remove the word markup', function() {
      blankView.removeWord($(words[0]));
      expect(blankView.stack).not.toContain(words[0]);
      expect(blankView.stack).toContain(words[1]);
    });

    it('should remove the word from the tracker', function() {
      blankView.removeWord($(words[0]));
      expect(blankView.words).not.toContain('word2');
      expect(blankView.words).toContain('word1');
    });

  });

});
