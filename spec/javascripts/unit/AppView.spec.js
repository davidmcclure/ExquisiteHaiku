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

  });

  describe('initialization', function() {

    it('should call buildTemplates()', function() {

      // Spy on buildTemplates.
      spyOn(appView, 'buildTemplates');

      // Construct view.
      appView.initialize();

      // Check for buildTemplates().
      expect(appView.buildTemplates).toHaveBeenCalled();

    });

  });

});
