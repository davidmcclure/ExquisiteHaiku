/*
 * Include dependencies.
 */

var a = 'public/javascripts/apps/poem/';
var v = 'public/javascripts/vendor/';

load(

  // jQuery, Underscore, Moment, d3.
  v+'jquery/jquery.js',
  v+'underscore/underscore.js',
  v+'d3/d3.js'

).then(

  // Backbone.
  v+'backbone/backbone.js'

).then(

  // Marionette and Socket.io.
  v+'backbone/marionette.js'

).then(

  // Backbone modules.
  v+'backbone/backbone-localstorage.js'

).then(

  // App.
  a+'app.js'

).then(

  // Collections.
  a+'collections/round-collection.js',

  // Views.
  a+'views/poem-view.js',
  a+'views/blank-view.js',
  a+'views/stack-view.js',
  a+'views/stack-word-view.js',
  a+'views/log-view.js',
  a+'views/log-word-view.js',
  a+'views/line-view.js',
  a+'views/points-view.js',
  a+'views/timer-view.js',

  // Controllers
  a+'controllers/poem-controller.js',
  a+'controllers/socket-controller.js',
  a+'controllers/round-controller.js',
  a+'controllers/stack-controller.js',
  a+'controllers/log-controller.js',
  a+'controllers/info-controller.js'

).thenRun(function() {

  // Mock poem.
  P = { _id: 1, rounds: [{ _id: 'id', points: 1000 }] };

});
