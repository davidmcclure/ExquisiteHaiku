
/**
 * Form controller.
 */

Add.Controllers.Form = (function(Backbone, Add) {

  var Form = {};


  // ---------------
  // Initialization.
  // ---------------

  /**
   * Instantiate form view.
   */
  Form.init = function() {
    Form.Form = new Add.Views.Form();
  };


  // Export.
  Add.addInitializer(function() { Form.init(); });
  return Form;

})(Backbone, Add);
