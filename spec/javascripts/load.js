/*
 * Include testing dependencies.
 */

var a = 'public/javascripts/app/';
var l = 'public/javascripts/lib/';

load(

  // Libraries.
  l+'jquery/jquery.js',
  l+'underscore/underscore.js'

).then (

  // Backbone.
  l+'backbone/backbone.js'

).then(

  // Views.
  a+'views/blank.js'

).then(

  // Models.
  a+'models/stack-word.js',

  // Views.
  a+'views/stack-word.js',
  a+'views/stack.js',
  a+'views/poem.js',
  a+'views/app.js'

).thenRun(function() {

  // Mock socket.
  Poem = { socket: io.connect() };

});
