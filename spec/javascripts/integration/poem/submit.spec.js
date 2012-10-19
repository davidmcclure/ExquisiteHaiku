/*
 * Integration tests for submission flow.
 */

describe('Submission', function() {

  var e;

  // Get fixtures, run app.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    _t.loadPoem();
  });

  // Mock keypress.
  beforeEach(function() {
    _t.isVoting();
    e = $.Event('keyup');
  });

  it('should execute a valid word submission', function() {

    // Set word value.
    _t.blank.$el.val('valid1');

    // Spy on socket vote release.
    spyOn(Ov.Controllers.Socket.s, 'emit');

    // Mock enter.
    e.keyCode = 13;
    _t.blank.$el.trigger(e);

    // Wait for valid1 in valid cache.
    waitsFor(function() {
      return _t.blank.$el.val() === '';
    }, 2000, 'Word never detected in valid cache.');

    // Check for vote release.
    runs(function() {
      expect(Ov.Controllers.Socket.s.emit).toHaveBeenCalledWith(
        'vote', 1, 'valid1', 100);
    });

  });

  it('should lowercase and trim a valid word', function() {

    // Set word value.
    _t.blank.$el.val(' Valid1  ');

    // Spy on socket vote release.
    spyOn(Ov.Controllers.Socket.s, 'emit');

    // Mock enter.
    e.keyCode = 13;
    _t.blank.$el.trigger(e);

    // Check for vote release.
    // expect(Ov.Controllers.Socket.s.emit).toHaveBeenCalledWith(
      // 'vote', 1, 'valid1', 100);

  });

  it('should not submit an invalid word', function() {

    // Set word value.
    _t.blank.$el.val('invalid');

    // Spy on socket vote release.
    spyOn(Ov.Controllers.Socket.s, 'emit');

    // Mock enter.
    e.keyCode = 13;
    _t.blank.$el.trigger(e);

    // Check for vote release.
    // expect(Ov.Controllers.Socket.s.emit).toHaveBeenCalledWith(
      // 'vote', 1, 'invalid', 100);

  });

});
