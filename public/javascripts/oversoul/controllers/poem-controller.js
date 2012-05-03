/*
 * Poem controller.
 */

Ov.Controllers.Poem = (function(Backbone, Ov) {

  var Poem = {};


  // -------
  // Events.
  // -------

  /*
   * Before the poem is re-rendered.
   *
   * @return void.
   */
  Ov.vent.on('poem:render:before', function() {
    // Detach blank.
    Poem.BlankView.detach();
  });

  /*
   * After the poem is re-rendered.
   *
   * @param {Element} line: The current active line.
   *
   * @return void.
   */
  Ov.vent.on('poem:render:after', function(line) {
    // Insert blank.
    Poem.BlankView.insert(line);
  });

  /*
   * On incoming data slice.
   *
   * @param {Object} data: The incoming slice data.
   *
   * @return void.
   */
  Ov.vent.on('socket:slice', function(data) {

  });


  // ---------------
  // Initialization.
  // ---------------

  Ov.addInitializer(function() {

    // Instantiate poem and blank.
    Poem.PoemView = new Ov.Views.Poem();
    Poem.BlankView = new Ov.Views.Blank();

  });

  return Poem;

})(Backbone, Ov);