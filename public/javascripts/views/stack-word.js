/*
 * Model for individual word in stack.
 */

define([
  'underscore',
  'backbone'
  ], function(_, Backbone) {

    var StackWordView = Backbone.View.extend({

      /*
       * The container markup.
       */
      tagName: 'div',

      /*
       * The container class.
       */
      className: 'stack-word',

      /*
       * Bind events.
       */
      events: {

      },

      /*
       * Render model.
       *
       * @return void.
       */
      render: function() {

      }

    });

    return StackWordView;

});
