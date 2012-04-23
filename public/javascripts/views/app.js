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
       * Application startup.
       *
       * @return void.
       */
      initialize: function(socket) {

        // Connect to socket.io.
        this.initializeSockets(socket);

      },

      /*
       * Subscribe to poem room, handle incoming slices.
       *
       * @param {Object} socket: Connected socket instance.
       *
       * @return void.
       */
      initializeSockets: function(socket) {

        // Connect to room.
        socket.on('connect', function() {
          socket.emit('join', Poem.slug);
        });

        // Ingest slice.
        socket.on('slice', function(data) {
          console.log(data);
        });

      }

    });

    return AppView;

});
