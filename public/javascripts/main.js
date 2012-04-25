/*
 * Include libraries and run application.
 */

require.config({
  paths: {
    jquery: '/javascripts/lib/jquery/jquery',
    underscore: '/javascripts/lib/underscore/underscore',
    backbone: '/javascripts/lib/backbone/backbone',
    socket: '/socket.io/socket.io',
    text: '/javascripts/lib/require/text'
  }
});

require([
  '/javascripts/views/app.js'
], function(AppView) {

  // Connect socket.io.
  var socket = io.connect();

  // Run application view.
  var appView = new AppView(socket);

});
