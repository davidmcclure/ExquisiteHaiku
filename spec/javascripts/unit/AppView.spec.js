/*
 * Unit tests for AppView.
 */

describe('App View', function() {

  var appView;

  beforeEach(function() {

    // Get fixtures.
    loadFixtures('fixtures.html');

    // Construct view.
    appView = new AppView();

  });

  afterEach(function() {
    $('#left, #right').remove();
  });

  describe('render', function() {

    it('should insert the application shell', function() {

      // Render.
      appView.render();

      // Check for shell.
      expect($('body')).toContain('#left');
      expect($('body')).toContain('#right');

    });

  });

});
