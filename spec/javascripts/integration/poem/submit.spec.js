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
    _t.blank.$el.trigger(e);

    // Spy on socket vote release.
    spyOn(_t.socket, 'emit');

    // Mock enter.
    e.keyCode = 13;
    _t.blank.$el.trigger(e);

    // Wait for input clear.
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
    _t.blank.$el.trigger(e);

    // Spy on socket vote release.
    spyOn(_t.socket, 'emit');

    // Mock enter.
    e.keyCode = 13;
    _t.blank.$el.trigger(e);

    // Wait for input clear.
    waitsFor(function() {
      return _t.blank.$el.val() === '';
    }, 2000, 'Word never detected in valid cache.');

    // Check for vote release.
    runs(function() {
      expect(Ov.Controllers.Socket.s.emit).toHaveBeenCalledWith(
        'vote', 1, 'valid1', 100);
    });

  });

  it('should not submit an invalid word', function() {

    // Set word value.
    _t.blank.$el.val('invalid');
    _t.blank.$el.trigger(e);

    // Spy on socket vote release.
    var spy = spyOn(_t.blank, 'validateWord');
    spyOn(_t.socket, 'emit');

    // Mock enter.
    e.keyCode = 13;
    _t.blank.$el.trigger(e);

    // Wait for input clear.
    waitsFor(function() {
      return spy.callCount == 1;
    }, 2000, 'Word never detected in valid cache.');

    // Check for vote release.
    runs(function() {
      expect(Ov.Controllers.Socket.s.emit).not.toHaveBeenCalled();
    });

  });

});
