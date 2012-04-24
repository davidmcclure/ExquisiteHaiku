/*
 * View for poem.
 */

define([
  'underscore',
  'backbone',
  'text!templates/poem-line.html',
  'text!templates/poem-word.html'
  ], function(_, Backbone, lineTemplate, wordTemplate) {

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
       * Build the templates.
       */
      lineTemplate: _.template(lineTemplate),
      wordTemplate: _.template(wordTemplate),

      /*
       * Bind events.
       */
      events: {

      },

      /*
       * Render the container element.
       *
       * @return void.
       */
      render: function() {

      },

      /*
       * Render poem words.
       *
       * @param {Array} poem: The poem.
       *
       * @return void.
       */
      update: function(poem) {

      }

    });

    return PoemView;

});
