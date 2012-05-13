/*
 * Include dependencies.
 */

var a = 'javascripts/oversoul/';
var v = 'javascripts/vendor/';

load(

  // jQuery, Underscore, Moment.
  v+'jquery/jquery.js',
  v+'underscore/underscore.js',
  v+'moment/moment.js'

).then(

  // Backbone and Socket.io.
  v+'backbone/backbone.js',
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
  a+'views/vote-view.js',
  a+'views/word-view.js',

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
