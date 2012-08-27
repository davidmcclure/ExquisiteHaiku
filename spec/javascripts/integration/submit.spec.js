/*
 * Integration tests for submission flow.
 */

describe('Submission', function() {

  var e;

  // Get fixtures, run app.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    _t.reset();
  });

  // Mock keypress.
  beforeEach(function() {
    e = $.Event('keyup');
  });

  it('should queue a valid word', function() {

    // Set word value.
    _t.blank.$el.val('valid1');

    // Mock enter.
    e.keyCode = 13;
    _t.blank.$el.trigger(e);

    // Check for word.
    var words = _t.blank.stack.find('div.submission-word');
    expect(words.length).toEqual(1);
    expect(words[0]).toHaveText('valid1');

  });

  it('should lowercase and trim a valid word', function() {

    // Set word value.
    _t.blank.$el.val(' Valid1  ');

    // Mock enter.
    e.keyCode = 13;
    _t.blank.$el.trigger(e);

    // Check for word.
    var words = _t.blank.stack.find('div.submission-word');
    expect(words.length).toEqual(1);
    expect(words[0]).toHaveText('valid1');

  });

  it('should prepend new words', function() {

    // Add first word.
    e.keyCode = 13;
    _t.blank.$el.val('valid1');
    _t.blank.$el.trigger(e);

    // Add second word.
    _t.blank.$el.val('valid2');
    _t.blank.$el.trigger(e);

    // Check for word.
    var words = _t.blank.stack.find('div.submission-word');
    expect(words.length).toEqual(2);
    expect(words[0]).toHaveText('valid2');
    expect(words[1]).toHaveText('valid1');

  });

  it('should not queue an invalid word', function() {

    // Set word value.
    _t.blank.$el.val('invalid');

    // Mock enter.
    e.keyCode = 13;
    _t.blank.$el.trigger(e);

    // Check for no word.
    expect(_t.blank.stack).not.toContain('div.submission-word');

  });

  it('should not double-queue a word', function() {

    // Add word.
    e.keyCode = 13;
    _t.blank.$el.val('valid1');
    _t.blank.$el.trigger(e);

    // Try to re-add.
    _t.blank.$el.val('valid1');
    _t.blank.$el.trigger(e);

    // Check just 1 instance.
    var words = _t.blank.stack.find('div.submission-word');
    expect(words.length).toEqual(1);
    expect(words[0]).toHaveText('valid1');

  });

  it('should highlight words in stack on hover', function() {

    // Add word.
    e.keyCode = 13;
    _t.blank.$el.val('valid1');
    _t.blank.$el.trigger(e);

    // Get word.
    var word = _t.blank.stack.find('div.submission-word').first();
    word.trigger('mouseenter');
    expect(word).toHaveClass('negative');

  });

  it('should delete words in stack on click', function() {

    // Add word.
    e.keyCode = 13;
    _t.blank.$el.val('valid1');
    _t.blank.$el.trigger(e);

    // Get word, mock click.
    var word = _t.blank.stack.find('div.submission-word').first();
    word.trigger('mousedown');

    // Check for no word.
    expect(_t.blank.stack).not.toContain('div.submission-word');

  });

  it('should queue previously deleted words', function() {

    // Add word.
    e.keyCode = 13;
    _t.blank.$el.val('valid1');
    _t.blank.$el.trigger(e);

    // Get word, mock click.
    var word = _t.blank.stack.find('div.submission-word').first();
    word.trigger('mousedown');

    // Re-add.
    _t.blank.$el.val('valid1');
    _t.blank.$el.trigger(e);

    // Check for word.
    var words = _t.blank.stack.find('div.submission-word');
    expect(words.length).toEqual(1);
    expect(words[0]).toHaveText('valid1');

  });

  it('should block submission when not enough words', function() {

    // Spy on blank:submit.
    var cb = jasmine.createSpy();
    Ov.vent.on('blank:submit', cb);

    // Set minSubmissions.
    Poem.minSubmissions = 3;

    // Add 2 words.
    e.keyCode = 13;
    _t.blank.$el.val('valid1');
    _t.blank.$el.trigger(e);
    _t.blank.$el.val('valid2');
    _t.blank.$el.trigger(e);

    // Attempt to submit.
    e.keyCode = 17;
    _t.blank.$el.trigger(e);
    expect(cb).not.toHaveBeenCalled();

  });

  it('should emit correct word list when enough words', function() {

    // Set minSubmissions.
    Poem.minSubmissions = 3;

    // Add 3 words.
    e.keyCode = 13;
    _t.blank.$el.val('valid1');
    _t.blank.$el.trigger(e);
    _t.blank.$el.val('valid2');
    _t.blank.$el.trigger(e);
    _t.blank.$el.val('valid3');
    _t.blank.$el.trigger(e);

    // Spy on socket submission release.
    spyOn(Ov.Controllers.Socket.s, 'emit');

    // Attempt to submit.
    e.keyCode = 17;
    _t.blank.$el.trigger(e);
    expect(Ov.Controllers.Socket.s.emit).toHaveBeenCalledWith(
      'submit', 1, ['valid1', 'valid2', 'valid3']);

  });

});
