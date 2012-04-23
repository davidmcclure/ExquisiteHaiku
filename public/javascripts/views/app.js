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
        console.log(socket);
      }

    });

    return AppView;

});
