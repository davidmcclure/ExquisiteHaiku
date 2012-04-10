/*
 * State manager and data router.
 */

define([
  'jquery',
  'underscore',
  'backbone'
  ], function($, _, Backbone) {

    var AppView = Backbone.View.extend({

      /*
       * .
       *
       * @return void.
       */
      initialize: function() {
        console.log('init');
      }

    });

    return AppView;

});
