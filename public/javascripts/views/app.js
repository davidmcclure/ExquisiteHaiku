/*
 * State manager and data router.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/StackWord',
  'socket'
  ], function($, _, Backbone, StackWord) {

    var AppView = Backbone.View.extend({

      /*
       * Application startup.
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
