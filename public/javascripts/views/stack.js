/*
 * View for stack.
 */

define([
  'underscore',
  'backbone'
], function(_, Backbone) {

  var StackView = Backbone.View.extend({

    /*
     * The container markup.
     */
    tagName: 'table',

    /*
     * The container class.
     */
    className: 'stack',

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

  return StackView;

});
