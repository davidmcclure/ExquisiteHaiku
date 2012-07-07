/*
 * Include dependencies.
 */

var a = 'javascripts/oversoul/';
var v = 'javascripts/vendor/';

load(

  // jQuery, Underscore, Moment, d3.
  v+'jquery/jquery.js',
  v+'underscore/underscore.js',
  v+'moment/moment.js',
  v+'d3/d3.js'

).then(

  // Backbone.
  v+'backbone/backbone.js'

).then(

  // Marionette and Socket.io.
  v+'backbone/marionette.js',
  'socket.io/socket.io.js'

).then(

  // Backbone modules.
  v+'backbone/backbone-localstorage.js'

).then(

  // Application.
  a+'app.js'

).then(

  // Collections.
  a+'collections/round-collection.js',

  // Views.
  a+'views/poem-view.js',
  a+'views/blank-view.js',
  a+'views/stack-view.js',
  a+'views/word-view.js',
  a+'views/line-view.js',

  // Controllers
  a+'controllers/poem-controller.js',
  a+'controllers/socket-controller.js',
  a+'controllers/round-controller.js',
  a+'controllers/stack-controller.js'

).thenRun(function() {

  // Run.
  $(function() {
    Ov.start();
  });

});
