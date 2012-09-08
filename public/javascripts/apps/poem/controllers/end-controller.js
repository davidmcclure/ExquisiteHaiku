/*
 * End state controller.
 */

Ov.Controllers.End = (function(Backbone, Ov) {

  var End = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate end state view.
   *
   * @return void.
   */
  End.init = function() {
    End.End = new Ov.Views.End();
  };


  // -------
  // Events.
  // -------

  /*
   * Render the completed poem.
   *
   * @param {Element} poem: The poem markup.
   *
   * @return void.
   */
  Ov.vent.on('poem:complete', function(poem) {
    End.End.render(poem);
  });


  // Export.
  Ov.addInitializer(function() { End.init(); });
  return End;

})(Backbone, Ov);
