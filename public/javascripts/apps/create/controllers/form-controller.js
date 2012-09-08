/*
 * Form controller.
 */

Create.Controllers.Form = (function(Backbone, Create) {

  var Form = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate form view.
   *
   * @return void.
   */
  Form.init = function() {
    Form.Form = new Create.Views.Form();
  };


  // Export.
  Create.addInitializer(function() { Form.init(); });
  return Form;

})(Backbone, Create);
