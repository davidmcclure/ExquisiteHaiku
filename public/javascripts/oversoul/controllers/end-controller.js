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


  // Export.
  Ov.addInitializer(function() { End.init(); });
  return End;

})(Backbone, Ov);
