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

  describe('initialization', function() {

    it('should call buildTemplates()', function() {

      // Spy on buildTemplates.
      spyOn(appView, 'buildTemplates');

      // Construct view.
      appView.initialize();

      // Check for buildTemplates().
      expect(appView.buildTemplates).toHaveBeenCalled();

    });

    it('should call render()', function() {

      // Spy on render.
      spyOn(appView, 'render');

      // Construct view.
      appView.initialize();

      // Check for render().
      expect(appView.render).toHaveBeenCalled();

    });

    it('should construct poem', function() {

      // Construct view.
      appView.initialize();

      // Check for poem
      expect(appView.poem.el).toBe('div.poem');

    });

    it('should call initializeSockets()', function() {

      // Spy on render.
      spyOn(appView, 'initializeSockets');

      // Construct view.
      appView.initialize();

      // Check for initializeSockets().
      expect(appView.initializeSockets).toHaveBeenCalled();

    });

  });

  describe('buildTemplates', function() {

    it('should set appTemplate', function() {

      // Build templates.
      appView.buildTemplates();

      // Check for template.
      expect(appView.appTemplate).toBeDefined();

    });

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

  describe('initializeSockets', function() {

    it('should construct and set socket', function() {

      // Run sockets.
      appView.initializeSockets();

      // Check for socket.
      expect(appView.socket).toBeDefined();

    });

  });

});
