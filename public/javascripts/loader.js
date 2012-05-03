/*
 * Include dependencies.
 */

var a = 'javascripts/oversoul/';
var v = 'javascripts/vendor/';

load(

  // jQuery and Underscore.
  v+'jquery/jquery.js',
  v+'underscore/underscore.js'

).then(

  // Backbone and Socket.io.
  v+'backbone/backbone.js',
  v+'marionette/marionette.js',
  'socket.io/socket.io.js'

).then(

  // Application.
  a+'app.js'

).then(

  // Views.
  a+'views/poem-view.js',
  a+'views/blank-view.js',

  // Controllers
  a+'controllers/poem-controller.js',
  a+'controllers/socket-controller.js'

).thenRun(function() {

  // Run.
  $(function() {
    Ov.start();
  });

});
