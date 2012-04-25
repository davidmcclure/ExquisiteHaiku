/*
 * Require and globalize application assets.
 */

require.config({
  baseUrl: '/public/',
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

});
