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

        // Construct poem.
        // Construct stacks.
        // Construct search.
        // Construct tickers.

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
        socket.on('slice', _.bind(function(data) {
          this.ingestSlice(data);
        }, this));

      },

      /*
       * Process an incoming data slice.
       *
       * @param {Object} data: The slice data.
       *
       * @return void.
       */
      ingestSlice: function(data) {
        console.log(data);
      }

    });

    return AppView;

});
