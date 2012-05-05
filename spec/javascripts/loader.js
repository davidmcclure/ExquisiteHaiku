/*
 * Include dependencies.
 */

var a = 'public/javascripts/oversoul/';
var v = 'public/javascripts/vendor/';

load(

  // jQuery and Underscore.
  v+'jquery/jquery.js',
  v+'underscore/underscore.js'

).then(

  // Backbone and Socket.io.
  v+'backbone/backbone.js',
  v+'backbone/marionette.js'

).then(

  // Backbone modules.
  v+'backbone/backbone-query.js',
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

  // Controllers
  a+'controllers/poem-controller.js',
  a+'controllers/socket-controller.js',
  a+'controllers/round-controller.js'

);
