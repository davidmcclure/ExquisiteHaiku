/*
 * State manager and data router.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'socket'
  ], function($, _, Backbone) {

    var AppView = Backbone.View.extend({

      /*
       * .
       *
       * @return void.
       */
      initialize: function() {

        // ** dev
        var socket = io.connect('http://localhost:3000');

        // Connect to room.
        socket.on('connect', function() {
          socket.emit('join poem', 'testslug');
        });

        // Ingest slice.
        socket.on('slice', function(data) {
          console.log(data);
        });

      }

    });

    return AppView;

});
