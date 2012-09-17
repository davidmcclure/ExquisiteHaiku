/*
 * Include dependencies.
 */

var a = '/javascripts/applications/add/';
var b = '/stylesheets/bootstrap/js/';
var v = '/javascripts/vendor/';

load(

  // jQuery, Underscore, d3.
  v+'jquery/jquery.js',
  v+'underscore/underscore.js',
  v+'d3/d3.js'

).then(

  // Backbone, Bootstrap.
  v+'backbone/backbone.js',
  b+'bootstrap.min.js'

).then(

  // Marionette.
  v+'backbone/marionette.js'

).then(

  // Backbone modules.
  v+'backbone/backbone-localstorage.js'

).then(

  // Application.
  a+'app.js'

).then(

  // Views.
  a+'views/form-view.js',

  // Controllers
  a+'controllers/form-controller.js'

).thenRun(function() {

  // Run.
  $(function() {
    Add.start();
  });

});
