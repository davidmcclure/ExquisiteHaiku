/*
 * Load fixtuers and run application.
 */

describe('[ Integration Runner ]', function() {

  // Get fixtures, run app.
  beforeEach(function() {
    loadFixtures('base.html', 'templates.html');
    Ov.start();
  });

  it('run', function() {});

});
