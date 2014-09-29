
/**
 * Integration tests for state management.
 */

describe('State', function() {

  var slice;

  // Get fixtures.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    _t.loadPoem();
  });

  beforeEach(function() {

    // Stack.
    var stack = [
      ['word1', 100, 1000, 0, '1.00'],
      ['word2', 90, 0, -900, '0.50'],
      ['word3', 80, 800, 0, '0.40'],
      ['word4', 70, 0, -700, '0.30']
    ];

    // Slice.
    slice = {
      stack: stack,
      syllables: 0,
      round: 'id',
      poem: [],
      clock: 10000
    };

  });

  describe('initialization', function() {

    it('should register new round when no round record', function() {

    });

    it('should reload existing round when round record', function() {

    });

  });

  describe('new round', function() {

    it('should clear the stack', function() {

    });

    it('should clear the blank', function() {

    });

  });

});
