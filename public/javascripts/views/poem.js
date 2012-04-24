/*
 * View for poem.
 */

define([
  'underscore',
  'backbone'
  ], function(_, Backbone) {

    var PoemView = Backbone.View.extend({

      /*
       * The container markup.
       */
      tagName: 'div',

      /*
       * The container class.
       */
      className: 'poem',

      /*
       * Bind events.
       */
      events: {

      },

      /*
       * Render poem.
       *
       * @return void.
       */
      render: function() {

      }

    });

    return PoemView;

});
